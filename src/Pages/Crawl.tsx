import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

// Components
import { PageHeader } from "../Components";
import {
    Form,
    Input,
    InputNumber,
    Button,
    Card,
    Progress,
    Typography,
    Space,
    Alert,
    Collapse,
    Tabs,
    Checkbox,
} from "antd";
import {
    SearchOutlined,
    StopOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";

// Hooks
import { useDatabase } from "../hooks/useDatabase";

// Atoms
import {
    useValue as useUserValue,
    useState as useUserState,
} from "../Atoms/User";
import {
    useValue as usePassValue,
    useState as usePassState,
} from "../Atoms/Pass";

interface CrawlConfig {
    url: string;
    user: string;
    pass: string;
    max_depth: number;
    max_concurrent: number;
}

interface CrawlProgress {
    is_running: boolean;
    current_url: string;
    found_count: number;
    error_count: number;
}

interface CrawlResult {
    url: string;
    path: string;
    depth: number;
    status_code: number;
    content_type: string;
    title: string | null;
    is_error: boolean;
}

interface CrawlResponse {
    success: boolean;
    message: string;
    results: CrawlResult[];
}

const Crawl: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [crawlForm] = Form.useForm();
    const [directForm] = Form.useForm();

    const [, setUser] = useUserState();
    const [, setPass] = usePassState();
    const userValue = useUserValue();
    const passValue = usePassValue();

    const [activeTab, setActiveTab] = useState<string>("crawl");
    const [isCrawling, setIsCrawling] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState<CrawlProgress | null>(null);
    const [error, setError] = useState<string | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const { clearAll, insertPages } = useDatabase();

    // 進捗イベントをリッスン
    useEffect(() => {
        const unlisten = listen<CrawlProgress>("crawl_progress", (event) => {
            setProgress(event.payload);
        });

        return () => {
            unlisten.then((fn) => fn());
        };
    }, []);

    // クロール送信
    const handleCrawlSubmit = async (values: {
        url: string;
        user: string;
        pass: string;
        max_depth: number;
        max_concurrent: number;
    }) => {
        setError(null);
        setIsCrawling(true);
        setProgress({
            is_running: true,
            current_url: values.url,
            found_count: 0,
            error_count: 0,
        });

        // 進捗表示セクションまでスクロール
        setTimeout(() => {
            progressRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);

        // 認証情報を保存
        setUser(values.user || "");
        setPass(values.pass || "");

        try {
            // 前回のデータをクリア
            await clearAll();

            const config: CrawlConfig = {
                url: values.url,
                user: values.user || "",
                pass: values.pass || "",
                max_depth: values.max_depth ?? 3,
                max_concurrent: values.max_concurrent ?? 5,
            };

            const response = await invoke<CrawlResponse>("start_crawl", {
                config,
            });

            if (response.success && response.results.length > 0) {
                // DBに保存
                await insertPages(
                    response.results.map((r) => ({
                        url: r.url,
                        path: r.path,
                        depth: r.depth,
                        status_code: r.status_code,
                        content_type: r.content_type,
                        title: r.title,
                        is_error: r.is_error,
                    }))
                );

                // ページ一覧へ遷移
                navigate("/pages");
            } else if (response.results.length === 0) {
                setError("No pages found. Please check the URL and try again.");
            }
        } catch (e) {
            setError(String(e));
        } finally {
            setIsCrawling(false);
            setProgress(null);
        }
    };

    const handleStop = async () => {
        try {
            await invoke("stop_crawl");
        } catch (e) {
            console.error(e);
        }
    };

    // URL直接指定送信
    const handleDirectSubmit = async (values: {
        urls: string;
        user: string;
        pass: string;
        clearExisting: boolean;
    }) => {
        setError(null);
        setIsProcessing(true);

        // 認証情報を保存
        setUser(values.user || "");
        setPass(values.pass || "");

        try {
            // URLを解析
            const urlLines = values.urls
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0);

            if (urlLines.length === 0) {
                setError(t("crawl.direct.error_empty"));
                return;
            }

            // URL形式の検証とドメインチェック
            const parsedUrls: URL[] = [];
            let firstDomain: string | null = null;

            for (const urlStr of urlLines) {
                try {
                    const url = new URL(urlStr);
                    if (url.protocol !== "http:" && url.protocol !== "https:") {
                        setError(
                            t("crawl.direct.error_invalid_url", { url: urlStr })
                        );
                        return;
                    }

                    const domain = url.origin;
                    if (firstDomain === null) {
                        firstDomain = domain;
                    } else if (domain !== firstDomain) {
                        setError(t("crawl.direct.error_different_domain"));
                        return;
                    }

                    parsedUrls.push(url);
                } catch {
                    setError(
                        t("crawl.direct.error_invalid_url", { url: urlStr })
                    );
                    return;
                }
            }

            // クリアするか追加するか
            if (values.clearExisting) {
                await clearAll();
            }

            // 各URLの情報を取得してDBに保存
            const pages: {
                url: string;
                path: string;
                depth: number;
                status_code: number;
                content_type: string;
                title: string | null;
                is_error: boolean;
            }[] = [];

            for (const url of parsedUrls) {
                try {
                    // タイトル取得を試みる
                    const result = await invoke<Record<string, string>>(
                        "get_title_meta",
                        {
                            url: url.toString(),
                            user: values.user || "",
                            pass: values.pass || "",
                        }
                    ).catch(() => null);

                    pages.push({
                        url: url.toString(),
                        path: url.pathname + url.search,
                        depth: 0,
                        status_code: result ? 200 : 0,
                        content_type: "text/html",
                        title: result?.title || null,
                        is_error: !result,
                    });
                } catch {
                    pages.push({
                        url: url.toString(),
                        path: url.pathname + url.search,
                        depth: 0,
                        status_code: 0,
                        content_type: "",
                        title: null,
                        is_error: true,
                    });
                }
            }

            if (pages.length > 0) {
                await insertPages(pages);
                navigate("/pages");
            }
        } catch (e) {
            setError(String(e));
        } finally {
            setIsProcessing(false);
        }
    };

    // クロールタブの内容
    const CrawlTab = (
        <Form
            form={crawlForm}
            layout="vertical"
            onFinish={handleCrawlSubmit}
            initialValues={{
                url: "",
                user: userValue,
                pass: passValue,
                max_depth: 3,
                max_concurrent: 5,
            }}
            disabled={isCrawling}>
            <Form.Item
                name="url"
                label={t("crawl.url")}
                rules={[
                    { required: true, message: "URL is required" },
                    {
                        type: "url",
                        message: "Please enter a valid URL",
                    },
                ]}>
                <Input
                    placeholder={String(t("crawl.url_placeholder"))}
                    size="large"
                />
            </Form.Item>

            <Collapse
                ghost
                items={[
                    {
                        key: "settings",
                        label: t("common.more"),
                        children: (
                            <>
                                <Alert
                                    type="info"
                                    message={t("form.warning")}
                                    style={{ marginBottom: 16 }}
                                />
                                <Space
                                    size="large"
                                    style={{ width: "100%" }}
                                    wrap>
                                    <Form.Item
                                        name="user"
                                        label={t("common.user")}>
                                        <Input style={{ width: 200 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="pass"
                                        label={t("common.pass")}>
                                        <Input.Password
                                            style={{ width: 200 }}
                                        />
                                    </Form.Item>
                                </Space>
                                <Space
                                    size="large"
                                    style={{ width: "100%" }}
                                    wrap>
                                    <Form.Item
                                        name="max_depth"
                                        label={t("crawl.max_depth")}>
                                        <InputNumber
                                            min={1}
                                            max={10}
                                            style={{ width: 120 }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="max_concurrent"
                                        label={t("crawl.max_concurrent")}>
                                        <InputNumber
                                            min={1}
                                            max={20}
                                            style={{ width: 120 }}
                                        />
                                    </Form.Item>
                                </Space>
                            </>
                        ),
                    },
                ]}
            />

            <Form.Item style={{ marginTop: 16 }}>
                {!isCrawling ? (
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SearchOutlined />}
                        size="large">
                        {t("crawl.start")}
                    </Button>
                ) : (
                    <Button
                        danger
                        onClick={handleStop}
                        icon={<StopOutlined />}
                        size="large">
                        {t("crawl.stop")}
                    </Button>
                )}
            </Form.Item>
        </Form>
    );

    // URL直接指定タブの内容
    const DirectTab = (
        <Form
            form={directForm}
            layout="vertical"
            onFinish={handleDirectSubmit}
            initialValues={{
                urls: "",
                user: userValue,
                pass: passValue,
                clearExisting: true,
            }}
            disabled={isProcessing}>
            <Form.Item
                name="urls"
                label={t("crawl.direct.urls")}
                rules={[
                    {
                        required: true,
                        message: String(t("crawl.direct.urls_required")),
                    },
                ]}
                extra={t("crawl.direct.urls_help")}>
                <Input.TextArea
                    placeholder={String(t("crawl.direct.urls_placeholder"))}
                    rows={8}
                    style={{ fontFamily: "monospace" }}
                />
            </Form.Item>

            <Form.Item name="clearExisting" valuePropName="checked">
                <Checkbox>{t("crawl.direct.clear_existing")}</Checkbox>
            </Form.Item>

            <Collapse
                ghost
                items={[
                    {
                        key: "settings",
                        label: t("common.more"),
                        children: (
                            <>
                                <Alert
                                    type="info"
                                    message={t("form.warning")}
                                    style={{ marginBottom: 16 }}
                                />
                                <Space
                                    size="large"
                                    style={{ width: "100%" }}
                                    wrap>
                                    <Form.Item
                                        name="user"
                                        label={t("common.user")}>
                                        <Input style={{ width: 200 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="pass"
                                        label={t("common.pass")}>
                                        <Input.Password
                                            style={{ width: 200 }}
                                        />
                                    </Form.Item>
                                </Space>
                            </>
                        ),
                    },
                ]}
            />

            <Form.Item style={{ marginTop: 16 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<UnorderedListOutlined />}
                    size="large"
                    loading={isProcessing}>
                    {t("crawl.direct.submit")}
                </Button>
            </Form.Item>
        </Form>
    );

    const tabItems = [
        {
            key: "crawl",
            label: t("crawl.tab.crawl"),
            children: CrawlTab,
        },
        {
            key: "direct",
            label: t("crawl.tab.direct"),
            children: DirectTab,
        },
    ];

    return (
        <PageHeader
            primary={t("crawl.title")}
            secondary={t("crawl.description")}>
            <Card>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                />
            </Card>

            {/* 進捗表示 */}
            {progress && (
                <Card ref={progressRef} style={{ marginTop: 24 }}>
                    <Typography.Title level={5}>
                        {t("crawl.progress.title")}
                    </Typography.Title>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <div>
                            <Typography.Text type="secondary">
                                {t("crawl.progress.current")}:{" "}
                            </Typography.Text>
                            <Typography.Text ellipsis style={{ maxWidth: 500 }}>
                                {progress.current_url}
                            </Typography.Text>
                        </div>
                        <Space size="large">
                            <div>
                                <Typography.Text type="secondary">
                                    {t("crawl.progress.found")}:{" "}
                                </Typography.Text>
                                <Typography.Text strong>
                                    {progress.found_count}
                                </Typography.Text>
                            </div>
                            <div>
                                <Typography.Text type="secondary">
                                    {t("crawl.progress.errors")}:{" "}
                                </Typography.Text>
                                <Typography.Text
                                    strong
                                    type={
                                        progress.error_count > 0
                                            ? "danger"
                                            : undefined
                                    }>
                                    {progress.error_count}
                                </Typography.Text>
                            </div>
                        </Space>
                        <Progress
                            status="active"
                            percent={100}
                            showInfo={false}
                            strokeColor={{
                                "0%": "#108ee9",
                                "100%": "#87d068",
                            }}
                        />
                    </Space>
                </Card>
            )}

            {/* エラー表示 */}
            {error && (
                <Alert
                    type="error"
                    message={error}
                    closable
                    onClose={() => setError(null)}
                    style={{ marginTop: 24 }}
                />
            )}
        </PageHeader>
    );
};

export default Crawl;
