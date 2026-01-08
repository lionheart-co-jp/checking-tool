import React from "react";
import { useTranslation } from "react-i18next";

import { Alert, Badge } from "antd";
import { Image } from "./Image";

type Props = {
    url: string;
    alt?: string;
    src: string;
    status: "success" | "warning" | "error";
    user?: string;
    pass?: string;
};
export const AltRow: React.FC<Props> = ({
    url,
    alt,
    src,
    status,
    user,
    pass,
}) => {
    const { t } = useTranslation();

    return (
        <Alert
            type={status}
            showIcon
            message={
                alt ? (
                    alt
                ) : (
                    <Badge
                        style={{
                            backgroundColor:
                                status === "error" ? "#d32f2f" : "#ed6c02",
                        }}
                        count={t("common.not_found")}
                    />
                )
            }
            description={
                <div
                    style={{
                        marginTop: 10,
                    }}>
                    <Image
                        url={url}
                        image={src}
                        user={user}
                        pass={pass}
                        style={{ width: `auto`, maxWidth: 300, maxHeight: 300 }}
                    />
                </div>
            }></Alert>
    );
};
