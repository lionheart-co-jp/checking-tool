import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Components
import { PageHeader } from "../Components";
import { Row, Col, Card, Button } from "antd";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleClick = (path: string) => () => {
        navigate(path);
    };

    return (
        <PageHeader primary={t("apply.title")}>
            <Row gutter={[16, 16]} wrap>
                <Col xs={24} md={12}>
                    <Card
                        title={t("title.title")}
                        hoverable
                        onClick={handleClick("/title/")}>
                        {t("title.description")}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title={t("alt.title")}
                        hoverable
                        onClick={handleClick("/alt/")}>
                        {t("alt.description")}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title={t("headline.title")}
                        hoverable
                        onClick={handleClick("/headline/")}>
                        {t("headline.description")}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title={t("link.title")}
                        hoverable
                        onClick={handleClick("/link/")}>
                        {t("link.description")}
                    </Card>
                </Col>
            </Row>
        </PageHeader>
    );
};

export default Dashboard;
