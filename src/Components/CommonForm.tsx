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
import { Space, Form, Input, Button, Alert } from "antd";

type Props = {
    onSubmit: (url: string, user: string, pass: string) => Promise<boolean>;
};
export const CommonForm: React.FC<Props> = ({ onSubmit }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [url, setUrl] = useUrlState();
    const [, setResultUrl] = useUrlResultState();
    const [user, setUser] = useUserState();
    const [, setResultUser] = useUserResultState();
    const [pass, setPass] = usePassState();
    const [, setResultPass] = usePassResultState();

    const handleValueChange = ({
        url,
        user,
        pass,
    }: {
        url: string;
        user: string;
        pass: string;
    }) => {
        if (url !== undefined) {
            setUrl(url);
        }
        if (user !== undefined) {
            setUser(user);
        }
        if (pass !== undefined) {
            setPass(pass);
        }
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
        <Form
            layout="vertical"
            form={form}
            initialValues={{ url, user, pass }}
            onValuesChange={handleValueChange}
            size="large"
            className="commonForm">
            <Form.Item label="URL" name="url" style={{ marginBottom: 15 }}>
                <Input />
            </Form.Item>

            <Form.Item style={{ marginBottom: 15 }}>
                <Alert type="warning" description={t("form.warning")} />
            </Form.Item>

            <Space>
                <Form.Item name="user">
                    <Input placeholder={t("common.user")} />
                </Form.Item>
                <Form.Item name="pass">
                    <Input placeholder={t("common.pass")} />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        onClick={handleSubmit}>
                        Check
                    </Button>
                </Form.Item>
            </Space>
        </Form>
    );
};
