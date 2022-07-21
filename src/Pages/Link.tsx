import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useTranslation } from "react-i18next";

// Components
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CommonForm from "../Components/CommonForm";
import PageHeader from "../Components/PageHeader";
import LinkRow from "../Components/LinkRow";

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
        return true;
    };

    return (
        <Stack gap={5}>
            <Stack gap={2}>
                <PageHeader
                    primary={t("link.title")}
                    secondary={t("link.description")}
                />

                <CommonForm onSubmit={handleSubmit} />

                <Alert severity="error">
                    <AlertTitle>{t("common.warning")}</AlertTitle>
                    {t("link.warning")}
                </Alert>
            </Stack>

            {result && (
                <Stack gap={2}>
                    <Typography component="h3" variant="h6">
                        {t("common.result")}
                    </Typography>

                    {result.map((link, i) => (
                        <LinkRow key={i} link={link} />
                    ))}
                </Stack>
            )}
        </Stack>
    );
};

export default Dashboard;
