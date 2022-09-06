import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

// Atoms
import { useValue as useUrlValue } from "../Atoms/UrlResult";
import { useValue as useUserValue } from "../Atoms/UserResult";
import { useValue as usePassValue } from "../Atoms/PassResult";

// Components
import { Alert } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

type Props = {
    link: { href: string; target: string; content: string };
};
export const LinkRow: React.FC<Props> = ({ link }) => {
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
            icon={available === null ? <LoadingOutlined /> : null}
            showIcon
            type={available === null ? "info" : available ? "success" : "error"}
            message={link.href}
            description={link.content}
        />
    );
};
