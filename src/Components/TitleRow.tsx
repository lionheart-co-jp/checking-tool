import React, { useMemo } from "react";

import { Typography, Alert } from "antd";
import { VerticalSpace, Image } from "./";
import { useTranslation } from "react-i18next";

type Props = {
    url: string;
    result: Record<string, string>;
    user?: string;
    pass?: string;
};
export const TitleRow: React.FC<Props> = ({ url, result, user, pass }) => {
    const { t } = useTranslation();

    // Canonical URLのチェック
    const canonicalStatus = useMemo(() => {
        if (!result.canonical) {
            return { type: "warning" as const, match: false };
        }
        // URLを正規化して比較
        try {
            const pageUrl = new URL(url);
            const canonicalUrl = new URL(result.canonical, url);
            // パス、クエリ、フラグメントを除いたオリジンとパスで比較
            const normalizeUrl = (u: URL) => {
                let path = u.pathname;
                // 末尾のスラッシュを正規化
                if (path !== "/" && path.endsWith("/")) {
                    path = path.slice(0, -1);
                }
                return `${u.origin}${path}`;
            };
            const match = normalizeUrl(pageUrl) === normalizeUrl(canonicalUrl);
            return {
                type: match ? ("success" as const) : ("error" as const),
                match,
            };
        } catch {
            return { type: "error" as const, match: false };
        }
    }, [url, result.canonical]);

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
                        <Typography.Text>Viewport</Typography.Text>
                        <Alert
                            showIcon
                            type={result.viewport ? "success" : "error"}
                            description={
                                result.viewport ?? t("common.not_found")
                            }
                        />
                    </div>
                    <div>
                        <Typography.Text>Canonical URL</Typography.Text>
                        <Alert
                            showIcon
                            type={canonicalStatus.type}
                            description={
                                result.canonical ? (
                                    <>
                                        {result.canonical}
                                        {!canonicalStatus.match && (
                                            <>
                                                <br />
                                                <Typography.Text type="danger">
                                                    {t(
                                                        "title.canonical.mismatch"
                                                    )}
                                                </Typography.Text>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    t("common.not_found")
                                )
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
                                                user={user}
                                                pass={pass}
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

            <section>
                <Typography.Title level={3}>
                    {t("title.analytics.title")}
                </Typography.Title>
                <VerticalSpace size="middle">
                    <div>
                        <Typography.Text>
                            Google Analytics 4 (GA4)
                        </Typography.Text>
                        <Alert
                            showIcon
                            type={result["ga4"] ? "success" : "warning"}
                            description={result["ga4"] ?? t("common.not_found")}
                        />
                    </div>
                    <div>
                        <Typography.Text>
                            Universal Analytics (UA)
                        </Typography.Text>
                        <Alert
                            showIcon
                            type={result["ua"] ? "info" : "info"}
                            description={
                                result["ua"] ?? (
                                    <>
                                        {t("common.not_found")}
                                        <br />
                                        <Typography.Text type="secondary">
                                            {t("title.analytics.ua_deprecated")}
                                        </Typography.Text>
                                    </>
                                )
                            }
                        />
                    </div>
                    <div>
                        <Typography.Text>
                            Google Tag Manager (GTM)
                        </Typography.Text>
                        <Alert
                            showIcon
                            type={result["gtm"] ? "success" : "warning"}
                            description={result["gtm"] ?? t("common.not_found")}
                        />
                    </div>
                </VerticalSpace>
            </section>
        </VerticalSpace>
    );
};
