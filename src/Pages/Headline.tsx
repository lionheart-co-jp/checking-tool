import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useTranslation } from "react-i18next";

// Components
import { Alert, Typography } from "antd";
import { CommonForm, PageHeader, VerticalSpace } from "../Components";

const Headline: React.FC = () => {
    const { t } = useTranslation();
    const [result, setResult] = useState<
        | {
              name: string;
              content: string;
              level: number;
              flag: boolean;
              error: string;
          }[]
        | null
    >(null);

    const handleSubmit = async (url: string, user: string, pass: string) => {
        const result = await invoke<{ name: string; content: string }[]>(
            "get_headline_list",
            { url, user, pass }
        ).catch((e) => alert(e));

        if (!result) {
            return false;
        }

        let hasH1 = false;
        let prev = 0;
        setResult(
            result.map((row) => {
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
            })
        );
        return true;
    };

    return (
        <PageHeader
            primary={t("headline.title")}
            secondary={t("headline.description")}>
            <CommonForm onSubmit={handleSubmit} />

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

                {result && (
                    <section>
                        <Typography.Title level={3}>
                            {t("common.result")}
                        </Typography.Title>
                        <VerticalSpace size="middle">
                            {result.map((headline, i) => (
                                <Alert
                                    key={i}
                                    type={headline.flag ? "success" : "error"}
                                    showIcon
                                    style={{
                                        marginLeft: (headline.level - 1) * 15,
                                    }}
                                    message={
                                        <>
                                            {headline.name}
                                            {headline.error && (
                                                <Typography.Text
                                                    type="danger"
                                                    style={{ marginLeft: 10 }}>
                                                    {headline.error}
                                                </Typography.Text>
                                            )}
                                        </>
                                    }
                                    description={headline.content}
                                />
                            ))}
                        </VerticalSpace>
                    </section>
                )}
            </VerticalSpace>
        </PageHeader>
    );
};

export default Headline;
