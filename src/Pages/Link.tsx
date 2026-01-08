import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";

// Components
import { Typography, Alert, Button, Space, Spin, Collapse } from "antd";
import { PageHeader, LinkRow, VerticalSpace } from "../Components";
import { ArrowLeftOutlined } from "@ant-design/icons";

// Hooks
import { useDatabase, PageRecord } from "../hooks/useDatabase";

// Atoms
import { useValue as useDarkModeValue } from "../Atoms/DarkMode";

const Link: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isDarkMode = useDarkModeValue();

    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState<PageRecord[]>([]);
    const [results, setResults] = useState<
        | {
              url: string;
              path: string;
              result: { href: string; target: string; content: string }[];
          }[]
        | null
    >(null);

    const { getPagesByIds, insertCheckResult, insertCheckIssue } =
        useDatabase();

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
                    result: { href: string; target: string; content: string }[];
                }[] = [];

                for (const page of pagesData) {
                    if (page.is_error) continue;

                    const result = await invoke<
                        { href: string; target: string; content: string }[]
                    >("get_link_list", {
                        url: page.url,
                        user,
                        pass,
                    }).catch(() => null);

                    if (!result) continue;

                    // DBに結果を保存
                    await insertCheckResult(page.id, "link");

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
                primary={t("link.title")}
                secondary={t("link.description")}>
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
        <PageHeader primary={t("link.title")} secondary={t("link.description")}>
            <Space style={{ marginBottom: 16 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/pages")}>
                    {t("pageList.title")}
                </Button>
            </Space>

            <VerticalSpace size="large">
                <Alert
                    type="error"
                    message={t("common.warning")}
                    description={t("link.warning")}
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
                            defaultActiveKey={
                                results.length > 1 ? undefined : 0
                            }
                            className={`stickyCollapse ${
                                isDarkMode ? "is-dark" : ""
                            }`}>
                            {results.map(({ url, path, result }, i) => (
                                <Collapse.Panel header={path} key={i}>
                                    <VerticalSpace size="middle">
                                        {result.map((link, j) => (
                                            <LinkRow
                                                key={j}
                                                link={link}
                                                baseUrl={url}
                                                user={user}
                                                pass={pass}
                                            />
                                        ))}
                                    </VerticalSpace>
                                </Collapse.Panel>
                            ))}
                        </Collapse>
                    </section>
                )}
            </VerticalSpace>
        </PageHeader>
    );
};

export default Link;
