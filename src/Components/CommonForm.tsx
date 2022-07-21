import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

// Atoms
import { useState as useUrlState } from "../Atoms/Url";
import { useState as useUrlResultState } from "../Atoms/UrlResult";
import { useState as useUserState } from "../Atoms/User";
import { useState as useUserResultState } from "../Atoms/UserResult";
import { useState as usePassState } from "../Atoms/Pass";
import { useState as usePassResultState } from "../Atoms/PassResult";

// Components
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";

type Props = {
    onSubmit: (url: string, user: string, pass: string) => Promise<boolean>;
};
const CommonForm: React.FC<Props> = ({ onSubmit }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const [url, setUrl] = useUrlState();
    const [, setResultUrl] = useUrlResultState();
    const [user, setUser] = useUserState();
    const [, setResultUser] = useUserResultState();
    const [pass, setPass] = usePassState();
    const [, setResultPass] = usePassResultState();

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };
    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser(e.target.value);
    };
    const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPass(e.target.value);
    };

    const handleSubmit = useCallback(async () => {
        setLoading(true);

        const result = await onSubmit(url, user, pass);
        if (!result) {
            setLoading(false);
            return;
        }

        setResultUrl(url);
        setResultUser(user);
        setResultPass(pass);

        setLoading(false);
    }, [onSubmit, url, user, pass, setResultUrl, setResultUser, setResultPass]);

    return (
        <>
            <Stack gap={2}>
                <TextField
                    label="URL"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={url}
                    onChange={handleUrlChange}
                />

                <Alert severity="warning">{t("form.warning")}</Alert>

                <Stack direction="row" alignItems="center" gap={1}>
                    <TextField
                        label={t("common.user")}
                        variant="outlined"
                        size="small"
                        value={user}
                        onChange={handleUserChange}
                    />
                    <TextField
                        label={t("common.pass")}
                        variant="outlined"
                        size="small"
                        value={pass}
                        onChange={handlePassChange}
                    />
                    <Box sx={{ ml: "auto" }}>
                        <LoadingButton
                            loading={loading}
                            variant="contained"
                            onClick={handleSubmit}>
                            Check
                        </LoadingButton>
                    </Box>
                </Stack>
            </Stack>
        </>
    );
};

export default CommonForm;
