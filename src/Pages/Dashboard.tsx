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
                        extra={
                            <Button onClick={handleClick("/title/")}>
                                {t("common.more")}
                            </Button>
                        }>
                        {t("title.description")}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title={t("alt.title")}
                        extra={
                            <Button onClick={handleClick("/alt/")}>
                                {t("common.more")}
                            </Button>
                        }>
                        {t("alt.description")}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title={t("headline.title")}
                        extra={
                            <Button onClick={handleClick("/headline/")}>
                                {t("common.more")}
                            </Button>
                        }>
                        {t("headline.description")}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title={t("link.title")}
                        extra={
                            <Button onClick={handleClick("/link/")}>
                                {t("common.more")}
                            </Button>
                        }>
                        {t("link.description")}
                    </Card>
                </Col>
            </Row>
        </PageHeader>
    );
};

export default Dashboard;
