import React from "react";

import { Typography, Alert } from "antd";
import { VerticalSpace, Image } from "./";
import { useTranslation } from "react-i18next";

type Props = {
    url: string;
    result: Record<string, string>;
};
export const TitleRow: React.FC<Props> = ({ url, result }) => {
    const { t } = useTranslation();

    return (
        <VerticalSpace size="large">
            <section>
                <Typography.Title level={5}>
                    {t("common.basic")}
                </Typography.Title>
                <VerticalSpace size="middle">
                    <div>
                        <Typography.Text>Title</Typography.Text>
                        <Alert
                            showIcon
                            type={result.title ? "success" : "error"}
                            description={result.title ?? t("common.not_found")}
                        />
                    </div>
                    <div>
                        <Typography.Text>Description</Typography.Text>
                        <Alert
                            showIcon
                            type={result.description ? "success" : "error"}
                            description={
                                result.description ?? t("common.not_found")
                            }
                        />
                    </div>
                    <div>
                        <Typography.Text>Keyword</Typography.Text>
                        <Alert
                            showIcon
                            type={result.keywords ? "success" : "error"}
                            description={
                                result.keywords ?? t("common.not_found")
                            }
                        />
                    </div>
                    <div>
                        <Typography.Text>Vieport</Typography.Text>
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
                        <Typography.Text>og:title</Typography.Text>
                        <Alert
                            showIcon
                            type={result["og:title"] ? "success" : "error"}
                            description={
                                result["og:title"] ?? t("common.not_found")
                            }
                        />
                    </div>
                    <div>
                        <Typography.Text>og:type</Typography.Text>
                        <Alert
                            showIcon
                            type={result["og:type"] ? "success" : "error"}
                            description={
                                result["og:type"] ?? t("common.not_found")
                            }
                        />
                    </div>
                    <div>
                        <Typography.Text>og:url</Typography.Text>
                        <Alert
                            showIcon
                            type={result["og:url"] ? "success" : "error"}
                            description={
                                result["og:url"] ?? t("common.not_found")
                            }
                        />
                    </div>
                    <div>
                        <Typography.Text>og:description</Typography.Text>
                        <Alert
                            showIcon
                            type={
                                result["og:description"] ? "success" : "error"
                            }
                            description={
                                result["og:description"] ??
                                t("common.not_found")
                            }
                        />
                    </div>
                    <div>
                        <Typography.Text>og:site_name</Typography.Text>
                        <Alert
                            showIcon
                            type={result["og:site_name"] ? "success" : "error"}
                            description={
                                result["og:site_name"] ?? t("common.not_found")
                            }
                        />
                    </div>
                    <div>
                        <Typography.Text>og:image</Typography.Text>
                        <Alert
                            showIcon
                            type={result["og:image"] ? "success" : "error"}
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
                                                url={url}
                                                image={result["og:image"]}
                                                style={{
                                                    width: `100%`,
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
                        <Typography.Text>fb:app_id</Typography.Text>
                        <Alert
                            showIcon
                            type={result["fb:app_id"] ? "success" : "error"}
                            description={
                                result["fb:app_id"] ?? t("common.not_found")
                            }
                        />
                    </div>
                    <div>
                        <Typography.Text>twitter:card</Typography.Text>
                        <Alert
                            showIcon
                            type={result["twitter:card"] ? "success" : "error"}
                            description={
                                result["twitter:card"] ?? t("common.not_found")
                            }
                        />
                    </div>
                    <div>
                        <Typography.Text>twitter:site</Typography.Text>
                        <Alert
                            showIcon
                            type={result["twitter:site"] ? "success" : "error"}
                            description={
                                result["twitter:site"] ?? t("common.not_found")
                            }
                        />
                    </div>
                </VerticalSpace>
            </section>
        </VerticalSpace>
    );
};
