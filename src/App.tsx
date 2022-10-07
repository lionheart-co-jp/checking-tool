import React, { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { RecoilRoot } from "recoil";

// Pages
import Dashboard from "./Pages/Dashboard";
import Title from "./Pages/Title";
import Alt from "./Pages/Alt";
import Headline from "./Pages/Headline";
import Link from "./Pages/Link";

// Components
import { Navigation } from "./Components";
import { Layout } from "antd";

const App: React.FC = () => {
    const location = useLocation();
    const content = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!content.current) {
            return;
        }

        content.current.scrollTo({ left: 0, top: 0 });
    }, [location]);

    return (
        <RecoilRoot>
            <Layout style={{ minHeight: "100vh" }}>
                <Navigation />
                <Layout.Content
                    ref={content}
                    style={{ maxHeight: "100vh", overflow: "auto" }}>
                    <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="/title" element={<Title />} />
                        <Route path="/alt" element={<Alt />} />
                        <Route path="/headline" element={<Headline />} />
                        <Route path="/link" element={<Link />} />
                    </Routes>
                </Layout.Content>
            </Layout>
        </RecoilRoot>
    );
};

export default App;
