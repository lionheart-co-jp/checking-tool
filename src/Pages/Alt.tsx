import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Trans, useTranslation } from "react-i18next";

// Components
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CommonForm from "../Components/CommonForm";
import PageHeader from "../Components/PageHeader";
import Image from "../Components/Image";

// Icons
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

const AltPage: React.FC = () => {
    const { t } = useTranslation();
    const [result, setResult] = useState<{ src: string; alt: string }[] | null>(
        null
    );

    const handleSubmit = async (url: string, user: string, pass: string) => {
        const result = await invoke<{ src: string; alt: string }[]>("get_alt", {
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
        <>
            <Stack gap={5}>
                <Stack gap={2}>
                    <PageHeader
                        primary={t("alt.title")}
                        secondary={t("alt.description")}
                    />

                    <CommonForm onSubmit={handleSubmit} />

                    <Alert severity="info">
                        <AlertTitle>{t("alt.remarks.title")}</AlertTitle>

                        <Typography>
                            <ErrorOutlineOutlinedIcon
                                color="error"
                                sx={{ verticalAlign: "middle" }}
                            />{" "}
                            <Trans
                                i18nKey="alt.remarks.body1"
                                components={{
                                    strong: (
                                        <Typography
                                            component="span"
                                            color="error"
                                            fontWeight="bold"
                                        />
                                    ),
                                }}
                            />
                        </Typography>
                        <Typography>
                            <WarningAmberOutlinedIcon
                                color="warning"
                                sx={{ verticalAlign: "middle" }}
                            />{" "}
                            {t("alt.remarks.body2")}
                        </Typography>
                        <Typography>
                            <CheckCircleOutlinedIcon
                                color="success"
                                sx={{ verticalAlign: "middle" }}
                            />{" "}
                            {t("alt.remarks.body3")}
                        </Typography>
                    </Alert>
                </Stack>

                {result && (
                    <>
                        <Stack gap={2}>
                            <Typography component="h3" variant="h6">
                                {t("common.result")}
                            </Typography>

                            {result.map((img, i) => (
                                <Alert
                                    key={i}
                                    severity={
                                        img.alt
                                            ? "success"
                                            : Object.prototype.hasOwnProperty.call(
                                                  img,
                                                  "alt"
                                              )
                                            ? "warning"
                                            : "error"
                                    }>
                                    <AlertTitle>{img.alt}</AlertTitle>
                                    {img.src}

                                    <Box sx={{ mt: 2 }}>
                                        <Image
                                            image={img.src}
                                            style={{ maxWidth: 300 }}
                                        />
                                    </Box>
                                </Alert>
                            ))}
                        </Stack>
                    </>
                )}
            </Stack>
        </>
    );
};

export default AltPage;
