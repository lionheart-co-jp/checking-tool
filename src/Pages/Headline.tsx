import React, {useState} from "react";
import {invoke} from '@tauri-apps/api/tauri'

// Components
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CommonForm from '../Components/CommonForm';
import PageHeader from '../Components/PageHeader';

const Headline: React.FunctionComponent = () => {
    const [result, setResult] = useState<{name: string, content: string, level: number, flag: boolean, error: string}[] | null>(null);

    const handleSubmit = async (url: string, user: string, pass: string) => {
        const result = await invoke<{name: string, content: string}[]>('get_headline_list', {url, user, pass})
            .catch(e => alert(e))

        if (!result) {
            return false;
        }

        let hasH1 = false;
        let prev = 0;
        setResult(result.map(row => {
            let error = '';
            let flag = true;
            const level = Number(row.name.replace(/^h/, ''))

            if (level === 1) {
                if (hasH1) {
                    flag = false;
                    error = "<h1> tag must be only one in the page";
                }
                hasH1 = true;
            }

            if (flag && prev + 1 < level) {
                flag = false;
                error = "Don't skip headline level (e.g. <h1> -> <h3> is Not Good)";
            }
            prev = level;

            return {
                name: row.name,
                content: row.content,
                level,
                flag,
                error
            }
        }));
        return true;
    }

    return <>
        <Stack gap={5}>
            <Stack gap={2}>
                <Box>
                    <PageHeader>Check Headline</PageHeader>
                    <Typography>Checking Headline structure</Typography>
                </Box>

                <CommonForm onSubmit={handleSubmit} />

                <Alert severity="info">
                    <AlertTitle>Remarks when you prepare the headlines</AlertTitle>
                    Don't skip headline level (e.g. &lt;h1&gt; -&gt; &lt;h3&gt; is Not Good)<br />
                    &lt;h1&gt; tag must be only one in the page
                </Alert>
            </Stack>

            {result && (
                <>
                    <Stack gap={2}>
                        <Typography component="h3" variant="h6">Result</Typography>

                        {result.map((headline, i) => (
                            <Alert key={i} severity={headline.flag ? "success" : "error"} sx={{ml: (headline.level-1)*3}}>
                                <AlertTitle>{headline.name}{headline.error && (<Typography component="span" color="error" sx={{ml: 2}}>{headline.error}</Typography>)}</AlertTitle>
                                {headline.content}
                            </Alert>
                        ))}
                    </Stack>
                </>
            )}
        </Stack>
    </>
}

export default Headline;