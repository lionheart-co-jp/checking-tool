import React from "react";
import { useTranslation } from "react-i18next";

import { Alert, Badge } from "antd";
import { Image } from "./Image";

type Props = {
    alt?: string;
    src: string;
    status: "success" | "warning" | "error";
};
export const AltRow: React.FC<Props> = ({ alt, src, status }) => {
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
                    <Image image={src} style={{ maxWidth: 300 }} />
                </div>
            }></Alert>
    );
};
