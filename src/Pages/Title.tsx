import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useTranslation } from "react-i18next";

// Components
import { CommonFormBulk, PageHeader } from "../Components";
import { Alert, Collapse, Typography } from "antd";
import { TitleRow } from "../Components/TitleRow";

const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const [results, setResults] = useState<
        { url: string; result: Record<string, string> }[] | null
    >(null);

    const handleSubmit = async (urls: string, user: string, pass: string) => {
        const urlArray = urls.split(/\n/).map((url) => url.trim());
        const results: { url: string; result: Record<string, string> }[] = [];

        for (const url of urlArray) {
            const result = await invoke<Record<string, string>>(
                "get_title_meta",
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
        <PageHeader
            primary={t("title.title")}
            secondary={t("title.description")}>
            <CommonFormBulk onSubmit={handleSubmit} />

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

            {results !== null && (
                <section>
                    <Typography.Title level={3}>
                        {t("common.result")}
                    </Typography.Title>
                    <Collapse>
                        {results.map(({ url, result }, i) => (
                            <Collapse.Panel header={url} key={i}>
                                <TitleRow url={url} result={result} />
                            </Collapse.Panel>
                        ))}
                    </Collapse>
                </section>
            )}
        </PageHeader>
    );
};

export default Dashboard;
