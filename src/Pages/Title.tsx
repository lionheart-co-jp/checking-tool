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
import Image from "../Components/Image";

const Dashboard: React.FunctionComponent = () => {
    const [result, setResult] = useState<Record<string, string> | null>(null);

    const handleSubmit = async (url: string, user: string, pass: string) => {
        const result = await invoke<Record<string, string>>("get_title_meta", {
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
                    <Box>
                        <PageHeader>Check Title/Meta</PageHeader>
                        <Typography>
                            Checking Title and Meta informations
                        </Typography>
                    </Box>

                    <CommonForm onSubmit={handleSubmit} />

                    <Alert severity="info">
                        <AlertTitle>
                            Remarks when you prepare the title/meta informations
                        </AlertTitle>
                        {
                            "For the title, You should follow the director's instruction. If there is no instruction, please input as [Page name]｜[Site name]"
                        }
                        <br />
                        {
                            "Unless otherwise specified, You should input og:title same with title and og:description same with description."
                        }
                    </Alert>
                </Stack>

                {result && (
                    <>
                        <Stack gap={2}>
                            <Typography component="h3" variant="h6">
                                Basic
                            </Typography>

                            <Box>
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                    Title
                                </Typography>
                                <Alert
                                    severity={
                                        result.title ? "success" : "error"
                                    }>
                                    {result.title ?? "Not found"}
                                </Alert>
                            </Box>

                            <Box>
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                    Description
                                </Typography>
                                <Alert
                                    severity={
                                        result.description ? "success" : "error"
                                    }>
                                    {result.description ?? "Not found"}
                                </Alert>
                            </Box>

                            <Box>
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                    Keyword
                                </Typography>
                                <Alert
                                    severity={
                                        result.keywords ? "success" : "error"
                                    }>
                                    {result.keywords ?? "Not found"}
                                </Alert>
                            </Box>

                            <Box>
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                    Vieport
                                </Typography>
                                <Alert
                                    severity={
                                        result.viewport ? "success" : "error"
                                    }>
                                    {result.viewport ?? "Not found"}
                                </Alert>
                            </Box>
                        </Stack>

                        <Stack gap={2}>
                            <Typography component="h3" variant="h6">
                                OGP
                            </Typography>

                            <Box>
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                    og:title
                                </Typography>
                                <Alert
                                    severity={
                                        result["og:title"] ? "success" : "error"
                                    }>
                                    {result["og:title"] ?? "Not found"}
                                </Alert>
                            </Box>

                            <Box>
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                    og:type
                                </Typography>
                                <Alert
                                    severity={
                                        result["og:type"] ? "success" : "error"
                                    }>
                                    {result["og:type"] ?? "Not found"}
                                </Alert>
                            </Box>

                            <Box>
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                    og:url
                                </Typography>
                                <Alert
                                    severity={
                                        result["og:url"] ? "success" : "error"
                                    }>
                                    {result["og:url"] ?? "Not found"}
                                </Alert>
                            </Box>

                            <Box>
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                    og:description
                                </Typography>
                                <Alert
                                    severity={
                                        result["og:description"]
                                            ? "success"
                                            : "error"
                                    }>
                                    {result["og:description"] ?? "Not found"}
                                </Alert>
                            </Box>

                            <Box>
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                    og:site_name
                                </Typography>
                                <Alert
                                    severity={
                                        result["og:site_name"]
                                            ? "success"
                                            : "error"
                                    }>
                                    {result["og:site_name"] ?? "Not found"}
                                </Alert>
                            </Box>

                            <Box>
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                    og:image
                                </Typography>
                                <Alert
                                    severity={
                                        result["og:image"] ? "success" : "error"
                                    }>
                                    {result["og:image"] ?? "Not found"}

                                    {result["og:image"] && (
                                        <Box sx={{ mt: 1 }}>
                                            <Image
                                                image={result["og:image"]}
                                                style={{ maxWidth: 300 }}
                                            />
                                        </Box>
                                    )}
                                </Alert>
                            </Box>
                        </Stack>

                        <Stack gap={2}>
                            <Typography component="h3" variant="h6">
                                SNS
                            </Typography>

                            <Box>
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                    fb:app_id
                                </Typography>
                                <Alert
                                    severity={
                                        result["fb:app_id"]
                                            ? "success"
                                            : "error"
                                    }>
                                    {result["fb:app_id"] ?? "Not found"}
                                </Alert>
                            </Box>

                            <Box>
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                    twitter:card
                                </Typography>
                                <Alert
                                    severity={
                                        result["twitter:card"]
                                            ? "success"
                                            : "error"
                                    }>
                                    {result["twitter:card"] ?? "Not found"}
                                </Alert>
                            </Box>

                            <Box>
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                    twitter:site
                                </Typography>
                                <Alert
                                    severity={
                                        result["twitter:site"]
                                            ? "success"
                                            : "error"
                                    }>
                                    {result["twitter:site"] ?? "Not found"}
                                </Alert>
                            </Box>
                        </Stack>
                    </>
                )}
            </Stack>
        </>
    );
};

export default Dashboard;
