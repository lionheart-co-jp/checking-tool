import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Trans, useTranslation } from "react-i18next";

// Components
import {
    AltRow,
    CommonFormBulk,
    PageHeader,
    VerticalSpace,
} from "../Components";
import { Alert, Typography, Collapse } from "antd";

// Icons
import {
    InfoCircleOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";

const AltPage: React.FC = () => {
    const { t } = useTranslation();
    const [results, setResults] = useState<
        { url: string; result: { src: string; alt: string }[] }[] | null
    >(null);

    const handleSubmit = async (urls: string, user: string, pass: string) => {
        const urlArray = urls.split(/\n/).map((url) => url.trim());
        const results: {
            url: string;
            result: { src: string; alt: string }[];
        }[] = [];

        for (const url of urlArray) {
            const result = await invoke<{ src: string; alt: string }[]>(
                "get_alt",
                {
                    url,
                    user,
                    pass,
                }
            ).catch((e) => alert(e));

            if (!result) {
                continue;
            }
            results.push({ url, result });
        }

        setResults(results);
        return true;
    };

    return (
        <PageHeader primary={t("alt.title")} secondary={t("alt.description")}>
            <CommonFormBulk onSubmit={handleSubmit} />

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

                {results !== null && (
                    <section>
                        <Typography.Title level={3}>
                            {t("common.result")}
                        </Typography.Title>
                        <Collapse>
                            {results.map(({ url, result }, i) => (
                                <Collapse.Panel header={url} key={i}>
                                    <VerticalSpace size="middle">
                                        {result.map((img, i) => (
                                            <AltRow
                                                key={i}
                                                url={url}
                                                alt={img.alt}
                                                src={img.src}
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
