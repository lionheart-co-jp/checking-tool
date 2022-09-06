import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Trans, useTranslation } from "react-i18next";

// Components
import { AltRow, CommonForm, PageHeader, VerticalSpace } from "../Components";
import { Alert, Typography } from "antd";

// Icons
import {
    InfoCircleOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";

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
        <PageHeader primary={t("alt.title")} secondary={t("alt.description")}>
            <CommonForm onSubmit={handleSubmit} />

            <VerticalSpace size="large">
                <Alert
                    type="info"
                    message={t("alt.remarks.title")}
                    description={
                        <div>
                            <div>
                                <CloseCircleOutlined
                                    style={{
                                        fontSize: "1.4em",
                                        verticalAlign: "middle",
                                        color: "#d32f2f",
                                    }}
                                />{" "}
                                <Trans
                                    i18nKey="alt.remarks.body1"
                                    components={{
                                        strong: (
                                            <Typography.Text
                                                strong
                                                type="danger"
                                            />
                                        ),
                                    }}
                                />
                            </div>
                            <div>
                                <InfoCircleOutlined
                                    style={{
                                        fontSize: "1.4em",
                                        verticalAlign: "middle",
                                        color: "#ed6c02",
                                    }}
                                />{" "}
                                {t("alt.remarks.body2")}
                            </div>
                            <div>
                                <CheckCircleOutlined
                                    style={{
                                        fontSize: "1.4em",
                                        verticalAlign: "middle",
                                        color: "#2e7d32",
                                    }}
                                />{" "}
                                {t("alt.remarks.body3")}
                            </div>
                        </div>
                    }
                />

                {result && (
                    <div>
                        <Typography.Title level={3}>
                            {t("common.result")}
                        </Typography.Title>
                        <VerticalSpace size="middle">
                            {result.map((img, i) => (
                                <AltRow
                                    key={i}
                                    alt={img.alt}
                                    src={img.src}
                                    status={
                                        img.alt
                                            ? "success"
                                            : Object.prototype.hasOwnProperty.call(
                                                  img,
                                                  "alt"
                                              )
                                            ? "warning"
                                            : "error"
                                    }
                                />
                            ))}
                        </VerticalSpace>
                    </div>
                )}
            </VerticalSpace>
        </PageHeader>
    );
};

export default AltPage;
