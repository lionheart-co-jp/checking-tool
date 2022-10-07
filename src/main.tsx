import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/antd.css";
import "./style.css";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./i18n/en";
import ja from "./i18n/ja";

const lng = (() => {
    const lng = localStorage.getItem("lng");
    if (lng) {
        return lng;
    }

    for (const lang of navigator.languages) {
        switch (lang.toLowerCase()) {
            case "en":
            case "en-us":
                return "en";
            case "ja":
            case "ja-jp":
                return "ja";
        }
    }

    return "en";
})();

i18n.use(initReactI18next).init({
    resources: {
        en,
        ja,
    },
    lng,
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
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}
