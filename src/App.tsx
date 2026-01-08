import React, { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Pages
import Crawl from "./Pages/Crawl";
import PageList from "./Pages/PageList";
import Title from "./Pages/Title";
import Alt from "./Pages/Alt";
import Headline from "./Pages/Headline";
import Link from "./Pages/Link";

// Components
import { Navigation } from "./Components";
import { ConfigProvider, Layout, theme } from "antd";
import { useValue as useDarkModeValue } from "./Atoms/DarkMode";
const { defaultAlgorithm, darkAlgorithm } = theme;

const App: React.FC = () => {
    const location = useLocation();
    const content = useRef<HTMLElement>(null);
    const isDarkMode = useDarkModeValue();

    useEffect(() => {
        if (!content.current) {
            return;
        }

        content.current.scrollTo({ left: 0, top: 0 });
    }, [location]);

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
            }}>
            <Layout style={{ minHeight: "100vh" }}>
                <Navigation />
                <Layout.Content
                    ref={content}
                    style={{ maxHeight: "100vh", overflow: "auto" }}>
                    <Routes>
                        <Route index element={<Crawl />} />
                        <Route path="/pages" element={<PageList />} />
                        <Route path="/title" element={<Title />} />
                        <Route path="/alt" element={<Alt />} />
                        <Route path="/headline" element={<Headline />} />
                        <Route path="/link" element={<Link />} />
                    </Routes>
                </Layout.Content>
            </Layout>
        </ConfigProvider>
    );
};

export default App;
