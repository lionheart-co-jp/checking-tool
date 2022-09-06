import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useTranslation } from "react-i18next";

// Components
import { CommonForm, Image, PageHeader, VerticalSpace } from "../Components";
import { Alert, Typography } from "antd";

const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const [result, setResult] = useState<Record<string, string> | null>(null);

    const handleSubmit = async (url: string, user: string, pass: string) => {
        const result = await invoke<Record<string, string>>("get_title_meta", {
            url,
            user,
            pass,
        }).catch((e) => alert(e));

        if (!result) {
            return false;
        }

        setResult(result);
        return true;
    };

    return (
        <PageHeader
            primary={t("title.title")}
            secondary={t("title.description")}>
            <CommonForm onSubmit={handleSubmit} />

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
                style={{ marginBottom: 24 }}></Alert>

            {result && (
                <VerticalSpace size="large">
                    <section>
                        <Typography.Title level={3}>
                            {t("common.basic")}
                        </Typography.Title>
                        <VerticalSpace size="middle">
                            <div>
                                <Typography.Title level={5}>
                                    Title
                                </Typography.Title>
                                <Alert
                                    showIcon
                                    type={result.title ? "success" : "error"}
                                    description={
                                        result.title ?? t("common.not_found")
                                    }
                                />
                            </div>
                            <div>
                                <Typography.Title level={5}>
                                    Description
                                </Typography.Title>
                                <Alert
                                    showIcon
                                    type={
                                        result.description ? "success" : "error"
                                    }
                                    description={
                                        result.description ??
                                        t("common.not_found")
                                    }
                                />
                            </div>
                            <div>
                                <Typography.Title level={5}>
                                    Keyword
                                </Typography.Title>
                                <Alert
                                    showIcon
                                    type={result.keywords ? "success" : "error"}
                                    description={
                                        result.keywords ?? t("common.not_found")
                                    }
                                />
                            </div>
                            <div>
                                <Typography.Title level={5}>
                                    Vieport
                                </Typography.Title>
                                <Alert
                                    showIcon
                                    type={result.viewport ? "success" : "error"}
                                    description={
                                        result.viewport ?? t("common.not_found")
                                    }
                                />
                            </div>
                        </VerticalSpace>
                    </section>

                    <section>
                        <Typography.Title level={3}>OGP</Typography.Title>
                        <VerticalSpace size="middle">
                            <div>
                                <Typography.Title level={5}>
                                    og:title
                                </Typography.Title>
                                <Alert
                                    showIcon
                                    type={
                                        result["og:title"] ? "success" : "error"
                                    }
                                    description={
                                        result["og:title"] ??
                                        t("common.not_found")
                                    }
                                />
                            </div>
                            <div>
                                <Typography.Title level={5}>
                                    og:type
                                </Typography.Title>
                                <Alert
                                    showIcon
                                    type={
                                        result["og:type"] ? "success" : "error"
                                    }
                                    description={
                                        result["og:type"] ??
                                        t("common.not_found")
                                    }
                                />
                            </div>
                            <div>
                                <Typography.Title level={5}>
                                    og:url
                                </Typography.Title>
                                <Alert
                                    showIcon
                                    type={
                                        result["og:url"] ? "success" : "error"
                                    }
                                    description={
                                        result["og:url"] ??
                                        t("common.not_found")
                                    }
                                />
                            </div>
                            <div>
                                <Typography.Title level={5}>
                                    og:description
                                </Typography.Title>
                                <Alert
                                    showIcon
                                    type={
                                        result["og:description"]
                                            ? "success"
                                            : "error"
                                    }
                                    description={
                                        result["og:description"] ??
                                        t("common.not_found")
                                    }
                                />
                            </div>
                            <div>
                                <Typography.Title level={5}>
                                    og:site_name
                                </Typography.Title>
                                <Alert
                                    showIcon
                                    type={
                                        result["og:site_name"]
                                            ? "success"
                                            : "error"
                                    }
                                    description={
                                        result["og:site_name"] ??
                                        t("common.not_found")
                                    }
                                />
                            </div>
                            <div>
                                <Typography.Title level={5}>
                                    og:image
                                </Typography.Title>
                                <Alert
                                    showIcon
                                    type={
                                        result["og:image"] ? "success" : "error"
                                    }
                                    description={
                                        <>
                                            {result["og:image"] ??
                                                t("common.not_found")}
                                            {result["og:image"] && (
                                                <div
                                                    style={{
                                                        marginTop: 10,
                                                    }}>
                                                    <Image
                                                        image={
                                                            result["og:image"]
                                                        }
                                                        style={{
                                                            maxWidth: 300,
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    }
                                />
                            </div>
                        </VerticalSpace>
                    </section>

                    <section>
                        <Typography.Title level={3}>SNS</Typography.Title>
                        <VerticalSpace size="middle">
                            <div>
                                <Typography.Title level={5}>
                                    fb:app_id
                                </Typography.Title>
                                <Alert
                                    showIcon
                                    type={
                                        result["fb:app_id"]
                                            ? "success"
                                            : "error"
                                    }
                                    description={
                                        result["fb:app_id"] ??
                                        t("common.not_found")
                                    }
                                />
                            </div>
                            <div>
                                <Typography.Title level={5}>
                                    twitter:card
                                </Typography.Title>
                                <Alert
                                    showIcon
                                    type={
                                        result["twitter:card"]
                                            ? "success"
                                            : "error"
                                    }
                                    description={
                                        result["twitter:card"] ??
                                        t("common.not_found")
                                    }
                                />
                            </div>
                            <div>
                                <Typography.Title level={5}>
                                    twitter:site
                                </Typography.Title>
                                <Alert
                                    showIcon
                                    type={
                                        result["twitter:site"]
                                            ? "success"
                                            : "error"
                                    }
                                    description={
                                        result["twitter:site"] ??
                                        t("common.not_found")
                                    }
                                />
                            </div>
                        </VerticalSpace>
                    </section>
                </VerticalSpace>
            )}
        </PageHeader>
    );
};

export default Dashboard;
