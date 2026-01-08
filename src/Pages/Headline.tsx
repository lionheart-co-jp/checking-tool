import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";

// Components
import { Alert, Typography, Collapse, Button, Space, Spin } from "antd";
import { PageHeader, VerticalSpace } from "../Components";
import { ArrowLeftOutlined } from "@ant-design/icons";

// Hooks
import { useDatabase, PageRecord } from "../hooks/useDatabase";

// Atoms
import { useValue as useDarkModeValue } from "../Atoms/DarkMode";

const Headline: React.FC = () => {
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
              result: {
                  name: string;
                  content: string;
                  level: number;
                  flag: boolean;
                  error: string;
              }[];
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
                    result: {
                        name: string;
                        content: string;
                        level: number;
                        flag: boolean;
                        error: string;
                    }[];
                }[] = [];

                for (const page of pagesData) {
                    if (page.is_error) continue;

                    const result = await invoke<
                        { name: string; content: string }[]
                    >("get_headline_list", { url: page.url, user, pass }).catch(
                        () => null
                    );

                    if (!result) continue;

                    // DBに結果を保存
                    const resultId = await insertCheckResult(
                        page.id,
                        "headline"
                    );

                    let hasH1 = false;
                    let prev = 0;
                    const processedResult = result.map((row) => {
                        let error = "";
                        let flag = true;
                        const level = Number(row.name.replace(/^h/, ""));

                        if (level === 1) {
                            if (hasH1) {
                                flag = false;
                                error = t("headline.remarks.body2");
                            }
                            hasH1 = true;
                        }

                        if (flag && prev + 1 < level) {
                            flag = false;
                            error = t("headline.remarks.body1");
                        }
                        prev = level;

                        return {
                            name: row.name,
                            content: row.content,
                            level,
                            flag,
                            error,
                        };
                    });

                    // 問題があるものをDBに保存
                    for (const item of processedResult) {
                        if (!item.flag) {
                            await insertCheckIssue(
                                resultId,
                                "heading_error",
                                item.name,
                                item.error
                            );
                        }
                    }

                    checkResults.push({
                        url: page.url,
                        path: page.path,
                        result: processedResult,
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
                primary={t("headline.title")}
                secondary={t("headline.description")}>
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
            primary={t("headline.title")}
            secondary={t("headline.description")}>
            <Space style={{ marginBottom: 16 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/pages")}>
                    {t("pageList.title")}
                </Button>
            </Space>

            <VerticalSpace size="large">
                <Alert
                    type="info"
                    message={t("headline.remarks.title")}
                    description={
                        <>
                            {t("headline.remarks.body1")}
                            <br />
                            {t("headline.remarks.body2")}
                        </>
                    }
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
                            {results.map(({ path, result }, i) => (
                                <Collapse.Panel header={path} key={i}>
                                    <VerticalSpace size="middle">
                                        {result.map((headline, j) => (
                                            <Alert
                                                key={j}
                                                type={
                                                    headline.flag
                                                        ? "success"
                                                        : "error"
                                                }
                                                showIcon
                                                style={{
                                                    marginLeft:
                                                        (headline.level - 1) *
                                                        15,
                                                }}
                                                message={
                                                    <>
                                                        {headline.name}
                                                        {headline.error && (
                                                            <Typography.Text
                                                                type="danger"
                                                                style={{
                                                                    marginLeft: 10,
                                                                }}>
                                                                {headline.error}
                                                            </Typography.Text>
                                                        )}
                                                    </>
                                                }
                                                description={
                                                    <div
                                                        style={{
                                                            display:
                                                                "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            lineClamp: 2,
                                                            WebkitBoxOrient:
                                                                "vertical",
                                                            boxOrient:
                                                                "vertical",
                                                            overflow: "hidden",
                                                        }}>
                                                        {headline.content}
                                                    </div>
                                                }
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

export default Headline;
