import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

// Components
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CommonForm from "../Components/CommonForm";
import PageHeader from "../Components/PageHeader";
import LinkRow from "../Components/LinkRow";

const Dashboard: React.FunctionComponent = () => {
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
                <Box>
                    <PageHeader>Check Link</PageHeader>
                    <Typography>Check Link target available</Typography>
                </Box>

                <CommonForm onSubmit={handleSubmit} />

                <Alert severity="error">
                    <AlertTitle>Warning</AlertTitle>
                    This function will access to the all the links in the target
                    URL. so, you must NOT run this function multiple times in a
                    short time.
                </Alert>
            </Stack>

            {result && (
                <Stack gap={2}>
                    <Typography component="h3" variant="h6">
                        Result
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
