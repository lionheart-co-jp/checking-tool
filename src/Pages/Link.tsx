import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useTranslation } from "react-i18next";

// Components
import { Typography, Alert } from "antd";
import { CommonForm, PageHeader, LinkRow, VerticalSpace } from "../Components";

const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const [result, setResult] = useState<
        { href: string; target: string; content: string }[] | null
    >(null);

    const handleSubmit = async (url: string, user: string, pass: string) => {
        const result = await invoke<
            { href: string; target: string; content: string }[]
        >("get_link_list", {
            url,
            user,
            pass,
        }).catch((e) => alert(e));

        if (!result) {
            return false;
        }

        setResult(result);

        setTimeout(() => {
            document
                .getElementById("result")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        return true;
    };

    return (
        <PageHeader primary={t("link.title")} secondary={t("link.description")}>
            <CommonForm onSubmit={handleSubmit} />

            <VerticalSpace size="large">
                <Alert
                    type="error"
                    message={t("common.warning")}
                    description={t("link.warning")}
                />

                {result && (
                    <VerticalSpace size="middle" id="result">
                        <Typography.Title level={3}>
                            {t("common.result")}
                        </Typography.Title>

                        {result.map((link, i) => (
                            <LinkRow key={i} link={link} />
                        ))}
                    </VerticalSpace>
                )}
            </VerticalSpace>
        </PageHeader>
    );
};

export default Dashboard;
