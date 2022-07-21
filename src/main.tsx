import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./i18n/en";
import ja from "./i18n/ja";

i18n.use(initReactI18next).init({
    resources: {
        en,
        ja,
    },
    lng: "ja",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

// Components
import App from "./App";

const root = document.getElementById("root");
if (root) {
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <CssBaseline />

            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
    );
}
