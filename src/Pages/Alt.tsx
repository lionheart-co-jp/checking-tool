import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Trans, useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";

// Components
import { AltRow, PageHeader, VerticalSpace } from "../Components";
import { Alert, Typography, Collapse, Button, Space, Spin } from "antd";

// Icons
import {
    InfoCircleOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";

// Hooks
import { useDatabase, PageRecord } from "../hooks/useDatabase";

// Atoms
import { useValue as useDarkModeValue } from "../Atoms/DarkMode";

const AltPage: React.FC = () => {
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
              result: { src: string; alt: string }[];
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
                    result: { src: string; alt: string }[];
                }[] = [];

                for (const page of pagesData) {
                    if (page.is_error) continue;

                    const result = await invoke<{ src: string; alt: string }[]>(
                        "get_alt",
                        {
                            url: page.url,
                            user,
                            pass,
                        }
                    ).catch(() => null);

                    if (!result) continue;

                    // DBに結果を保存
                    const resultId = await insertCheckResult(page.id, "alt");
                    for (const img of result) {
                        const hasAlt = Object.prototype.hasOwnProperty.call(
                            img,
                            "alt"
                        );
                        if (!hasAlt) {
                            await insertCheckIssue(
                                resultId,
                                "missing_alt",
                                img.src,
                                "alt属性がありません"
                            );
                        } else if (!img.alt) {
                            await insertCheckIssue(
                                resultId,
                                "empty_alt",
                                img.src,
                                "alt属性が空です"
                            );
                        }
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
                primary={t("alt.title")}
                secondary={t("alt.description")}>
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
        <PageHeader primary={t("alt.title")} secondary={t("alt.description")}>
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
                    message={t("alt.remarks.title")}
                    description={
                        <div>
                            <div>
                                <CloseCircleOutlined
                                    style={{
                                        fontSize: "1.4em",
                                        verticalAlign: "middle",
                                        color: "#d32f2f",
                                    }}
                                />{" "}
                                <Trans
                                    i18nKey="alt.remarks.body1"
                                    components={{
                                        strong: (
                                            <Typography.Text
                                                strong
                                                type="danger"
                                            />
                                        ),
                                    }}
                                />
                            </div>
                            <div>
                                <InfoCircleOutlined
                                    style={{
                                        fontSize: "1.4em",
                                        verticalAlign: "middle",
                                        color: "#ed6c02",
                                    }}
                                />{" "}
                                {t("alt.remarks.body2")}
                            </div>
                            <div>
                                <CheckCircleOutlined
                                    style={{
                                        fontSize: "1.4em",
                                        verticalAlign: "middle",
                                        color: "#2e7d32",
                                    }}
                                />{" "}
                                {t("alt.remarks.body3")}
                            </div>
                        </div>
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
                            {results.map(({ url, path, result }, i) => (
                                <Collapse.Panel header={path} key={i}>
                                    <VerticalSpace size="middle">
                                        {result.map((img, j) => (
                                            <AltRow
                                                key={j}
                                                url={url}
                                                alt={img.alt}
                                                src={img.src}
                                                user={user}
                                                pass={pass}
                                                status={
                                                    img.alt
                                                        ? "success"
                                                        : Object.prototype.hasOwnProperty.call(
                                                              img,
                                                              "alt"
                                                          )
                                                        ? "warning"
                                                        : "error"
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

export default AltPage;
