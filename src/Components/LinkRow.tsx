import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

// Atoms
import { useValue as useUrlValue } from "../Atoms/UrlResult";
import { useValue as useUserValue } from "../Atoms/UserResult";
import { useValue as usePassValue } from "../Atoms/PassResult";

// Components
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CircularProgress from "@mui/material/CircularProgress";

type Props = {
    link: { href: string; target: string; content: string };
};
const LinkRow: React.FC<Props> = ({ link }) => {
    const [available, setAvailable] = useState<boolean | null>(null);
    const url = useUrlValue();
    const user = useUserValue();
    const pass = usePassValue();

    useEffect(() => {
        setAvailable(null);

        (async () => {
            const checkUrl = new URL(link.href, url);
            if (checkUrl && pass) {
                checkUrl.username = user;
                checkUrl.password = pass;
            }

            const result = await invoke<boolean>("get_link_available", {
                url: checkUrl.toString(),
                user,
                pass,
            }).catch((e) => alert(e));

            if (typeof result !== "boolean") {
                return;
            }

            setAvailable(result);
        })();
    }, [link]);

    return (
        <Alert
            iconMapping={{
                info: <CircularProgress size={20} />,
            }}
            severity={
                available === null ? "info" : available ? "success" : "error"
            }
            sx={{ wordBreak: "break-all" }}>
            <AlertTitle>{link.href}</AlertTitle>
            {link.content}
        </Alert>
    );
};

export default LinkRow;
