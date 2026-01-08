import React, { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Components
import { Layout, Menu, MenuProps } from "antd";

// Icons
import {
    SearchOutlined,
    UnorderedListOutlined,
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

    const selectedKeys = useMemo(() => {
        const keys: MenuProps["selectedKeys"] = [];

        if (location.pathname === "/") {
            keys.push("crawl");
        }
        if (location.pathname === "/pages" || location.pathname === "/pages/") {
            keys.push("pages");
        }
        if (location.pathname.startsWith("/title")) {
            keys.push("pages");
        }
        if (location.pathname.startsWith("/alt")) {
            keys.push("pages");
        }
        if (location.pathname.startsWith("/headline")) {
            keys.push("pages");
        }
        if (location.pathname.startsWith("/link")) {
            keys.push("pages");
        }

        switch (language) {
            case "en":
                keys.push("language.english");
                break;
            case "ja":
                keys.push("language.japanese");
                break;
        }

        return keys;
    }, [location, language]);

    const handleClick =
        (to: string): MenuProps["onClick"] =>
        () => {
            navigate(to);
        };

    const items: MenuProps["items"] = [
        {
            label: t("crawl.title"),
            key: "crawl",
            icon: <SearchOutlined />,
            onClick: handleClick("/"),
            style: {
                marginTop: 0,
                marginBottom: 0,
                flexShrink: 0,
            },
        },
        {
            label: t("pageList.title"),
            key: "pages",
            icon: <UnorderedListOutlined />,
            onClick: handleClick("/pages"),
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
                    defaultSelectedKeys={["crawl"]}
                    selectedKeys={selectedKeys}
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
