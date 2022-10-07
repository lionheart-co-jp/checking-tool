import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useTranslation } from "react-i18next";

// Components
import { Alert, Typography, Collapse } from "antd";
import { CommonFormBulk, PageHeader, VerticalSpace } from "../Components";

const Headline: React.FC = () => {
    const { t } = useTranslation();
    const [results, setResults] = useState<
        | {
              url: string;
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

    const handleSubmit = async (urls: string, user: string, pass: string) => {
        const urlArray = urls.split(/\n/).map((url) => url.trim());
        const results: {
            url: string;
            result: {
                name: string;
                content: string;
                level: number;
                flag: boolean;
                error: string;
            }[];
        }[] = [];

        for (const url of urlArray) {
            const result = await invoke<{ name: string; content: string }[]>(
                "get_headline_list",
                { url, user, pass }
            ).catch((e) => alert(e));

            if (!result) {
                continue;
            }

            let hasH1 = false;
            let prev = 0;
            results.push({
                url,
                result: result.map((row) => {
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
                }),
            });
        }

        setResults(results);
        return true;
    };

    return (
        <PageHeader
            primary={t("headline.title")}
            secondary={t("headline.description")}>
            <CommonFormBulk onSubmit={handleSubmit} />

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

                {results !== null && (
                    <section>
                        <Typography.Title level={3}>
                            {t("common.result")}
                        </Typography.Title>
                        <Collapse>
                            {results.map(({ url, result }, i) => (
                                <Collapse.Panel header={url} key={i}>
                                    <VerticalSpace size="middle">
                                        {result.map((headline, i) => (
                                            <Alert
                                                key={i}
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
                                                description={headline.content}
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
