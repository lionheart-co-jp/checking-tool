import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";

// Components
import { PageHeader } from "../Components";
import { Alert, Collapse, Typography, Button, Spin, Space } from "antd";
import { TitleRow } from "../Components/TitleRow";
import { ArrowLeftOutlined } from "@ant-design/icons";

// Hooks
import { useDatabase, PageRecord } from "../hooks/useDatabase";

// Atoms
import { useValue as useDarkModeValue } from "../Atoms/DarkMode";

const Title: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isDarkMode = useDarkModeValue();

    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState<PageRecord[]>([]);
    const [results, setResults] = useState<
        { url: string; path: string; result: Record<string, string> }[] | null
    >(null);

    const { getPagesByIds, insertCheckResult, insertPageMeta } = useDatabase();

    // クエリパラメータからページIDを取得
    const pageIds = searchParams.get("ids")?.split(",").map(Number) || [];
    const user = searchParams.get("user") || "";
    const pass = searchParams.get("pass") || "";

    // ページ情報を取得してチェック実行
    useEffect(() => {
        if (pageIds.length === 0) return;

        const fetchAndCheck = async () => {
            setLoading(true);
            try {
                const pagesData = await getPagesByIds(pageIds);
                setPages(pagesData);

                const checkResults: {
                    url: string;
                    path: string;
                    result: Record<string, string>;
                }[] = [];

                for (const page of pagesData) {
                    if (page.is_error) continue;

                    const result = await invoke<Record<string, string>>(
                        "get_title_meta",
                        {
                            url: page.url,
                            user,
                            pass,
                        }
                    ).catch(() => null);

                    if (!result) continue;

                    // DBに結果を保存
                    await insertCheckResult(page.id, "title");
                    for (const [key, value] of Object.entries(result)) {
                        await insertPageMeta(page.id, key, value);
                    }

                    checkResults.push({
                        url: page.url,
                        path: page.path,
                        result,
                    });
                }

                setResults(checkResults);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchAndCheck();
    }, []);

    // ページ一覧がない場合
    if (pageIds.length === 0) {
        return (
            <PageHeader
                primary={t("title.title")}
                secondary={t("title.description")}>
                <Alert
                    type="info"
                    message={t("pageList.no_pages")}
                    action={
                        <Button onClick={() => navigate("/pages")}>
                            {t("pageList.title")}
                        </Button>
                    }
                />
            </PageHeader>
        );
    }

    return (
        <PageHeader
            primary={t("title.title")}
            secondary={t("title.description")}>
            <Space style={{ marginBottom: 16 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/pages")}>
                    {t("pageList.title")}
                </Button>
            </Space>

            <Alert
                type="warning"
                message={t("title.remarks.title")}
                description={
                    <>
                        {t("title.remarks.body1")}
                        <br />
                        {t("title.remarks.body2")}
                    </>
                }
                style={{ marginBottom: 24 }}
            />

            {loading && (
                <div style={{ textAlign: "center", padding: 48 }}>
                    <Spin size="large" />
                    <Typography.Text
                        type="secondary"
                        style={{ display: "block", marginTop: 16 }}>
                        Checking {pages.length} pages...
                    </Typography.Text>
                </div>
            )}

            {!loading && results !== null && (
                <section id="result">
                    <Typography.Title level={3}>
                        {t("common.result")} ({results.length} pages)
                    </Typography.Title>
                    <Collapse
                        defaultActiveKey={results.length > 1 ? undefined : 0}
                        className={`stickyCollapse ${
                            isDarkMode ? "is-dark" : ""
                        }`}>
                        {results.map(({ url, path, result }, i) => (
                            <Collapse.Panel header={path} key={i}>
                                <TitleRow
                                    url={url}
                                    result={result}
                                    user={user}
                                    pass={pass}
                                />
                            </Collapse.Panel>
                        ))}
                    </Collapse>
                </section>
            )}
        </PageHeader>
    );
};

export default Title;
