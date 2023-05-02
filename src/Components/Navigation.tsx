import React, { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Components
import { Layout, Menu, MenuProps } from "antd";

// Icons
import {
    DashboardOutlined,
    FontSizeOutlined,
    FileImageOutlined,
    OrderedListOutlined,
    LinkOutlined,
    GlobalOutlined,
    BulbFilled,
    BulbOutlined,
} from "@ant-design/icons";

// Atoms
import { useState as useLanguageState } from "../Atoms/Language";
import { useState as useDarkModeState } from "../Atoms/DarkMode";

export const Navigation: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useLanguageState();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDarkMode, setDarkMode] = useDarkModeState();

    useEffect(() => {
        setLanguage(i18n.language);
    }, []);

    const selectLanguage = (lng: string) => {
        return () => {
            i18n.changeLanguage(lng);
            setLanguage(lng);
            localStorage.setItem("lng", lng);
        };
    };

    const selectedKeis = useMemo(() => {
        const keis: MenuProps["selectedKeys"] = [];

        if (location.pathname === "/") {
            keis.push("dashboard");
        }
        if (location.pathname === "/title/") {
            keis.push("title");
        }
        if (location.pathname === "/alt/") {
            keis.push("alt");
        }
        if (location.pathname === "/headline/") {
            keis.push("headline");
        }
        if (location.pathname === "/link/") {
            keis.push("link");
        }

        switch (language) {
            case "en":
                keis.push("language.english");
                break;
            case "ja":
                keis.push("language.japanese");
                break;
        }

        return keis;
    }, [location, language]);

    const handleClick =
        (to: string): MenuProps["onClick"] =>
        () => {
            navigate(to);
        };

    const items: MenuProps["items"] = [
        {
            label: t("dashboard.title"),
            key: "dashboard",
            icon: <DashboardOutlined />,
            onClick: handleClick("/"),
            style: {
                marginTop: 0,
                marginBottom: 0,
                flexShrink: 0,
            },
        },
        {
            label: t("title.title"),
            key: "title",
            icon: <FontSizeOutlined />,
            onClick: handleClick("/title/"),
            style: {
                marginTop: 0,
                marginBottom: 0,
                flexShrink: 0,
            },
        },
        {
            label: t("alt.title"),
            key: "alt",
            icon: <FileImageOutlined />,
            onClick: handleClick("/alt/"),
            style: {
                marginTop: 0,
                marginBottom: 0,
                flexShrink: 0,
            },
        },
        {
            label: t("headline.title"),
            key: "headline",
            icon: <OrderedListOutlined />,
            onClick: handleClick("/headline/"),
            style: {
                marginTop: 0,
                marginBottom: 0,
                flexShrink: 0,
            },
        },
        {
            label: t("link.title"),
            key: "link",
            icon: <LinkOutlined />,
            onClick: handleClick("/link/"),
            style: {
                marginTop: 0,
                marginBottom: 0,
                flexShrink: 0,
            },
        },
        {
            label: t("language.title"),
            key: "language",
            icon: <GlobalOutlined />,
            children: [
                {
                    label: t("language.english"),
                    key: "language.english",
                    onClick: selectLanguage("en"),
                },
                {
                    label: t("language.japanese"),
                    key: "language.japanese",
                    onClick: selectLanguage("ja"),
                },
            ],
            style: {
                marginTop: 0,
                marginBottom: 0,
                flexShrink: 0,
            },
        },
        {
            label: isDarkMode
                ? t("common.theme.dark")
                : t("common.theme.light"),
            key: "theme",
            onClick: () => setDarkMode((v) => !v),
            icon: isDarkMode ? <BulbOutlined /> : <BulbFilled />,
            style: {
                marginTop: "auto",
                flexShrink: 0,
            },
        },
    ];

    return (
        <>
            <Layout.Sider
                breakpoint="sm"
                collapsedWidth={46}
                style={{
                    maxHeight: "100vh",
                    overflow: "auto",
                }}>
                <Menu
                    items={items}
                    defaultSelectedKeys={["dashboard"]}
                    selectedKeys={selectedKeis}
                    style={{
                        minHeight: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                    }}
                />
            </Layout.Sider>
        </>
    );
};
