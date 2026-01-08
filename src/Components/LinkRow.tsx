import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

// Components
import { Alert } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

type Props = {
    link: { href: string; target: string; content: string };
    baseUrl: string;
    user?: string;
    pass?: string;
};
export const LinkRow: React.FC<Props> = ({
    link,
    baseUrl,
    user = "",
    pass = "",
}) => {
    const [available, setAvailable] = useState<boolean | null>(null);
    const [code, setCode] = useState<string | undefined>(undefined);

    useEffect(() => {
        setAvailable(null);

        (async () => {
            // 相対URLを絶対URLに変換
            let checkUrlStr: string;
            try {
                const checkUrl = new URL(link.href, baseUrl);
                if (pass) {
                    checkUrl.username = user;
                    checkUrl.password = pass;
                }
                checkUrlStr = checkUrl.toString();
            } catch {
                // URLパース失敗時はスキップ
                setAvailable(true);
                setCode("Skipped (invalid URL)");
                return;
            }

            const result = await invoke<{
                error: boolean;
                code?: string;
                message?: string;
            }>("get_link_available", {
                url: checkUrlStr,
                user,
                pass,
            }).catch((e) => {
                console.error(e);
                return null;
            });

            if (!result) {
                setAvailable(false);
                setCode("Request failed");
                return;
            }

            setAvailable(!result.error);
            setCode(result.code);
        })();
    }, [link, baseUrl, user, pass]);

    return (
        <Alert
            icon={available === null ? <LoadingOutlined /> : null}
            showIcon
            type={available === null ? "info" : available ? "success" : "error"}
            message={
                <div
                    style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}>
                    <a href={link.href} target="_blank" rel="noreferrer">
                        {link.href}
                    </a>
                </div>
            }
            description={
                <>
                    {code ? <div>{code}</div> : null}
                    <div
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            lineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            boxOrient: "vertical",
                            overflow: "hidden",
                        }}>
                        {link.content}
                    </div>
                </>
            }
        />
    );
};
