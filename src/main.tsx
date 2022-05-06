import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

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
