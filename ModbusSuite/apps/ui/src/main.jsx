import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider, CssBaseline } from "@mui/material";

import theme from "./theme/theme";



import App from "./App";
import MachineProvider from "./Context/MachineProvider";

window.addEventListener("error", (event) => {
    console.error("[Renderer] Unhandled error", {
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error,
    });
});

window.addEventListener("unhandledrejection", (event) => {
    console.error("[Renderer] Unhandled promise rejection", event.reason);
});

console.log("[Renderer] Mounting React application", {
    hasLicenseApi: Boolean(window.licenseAPI),
});

ReactDOM.createRoot(document.getElementById("root")).render(

    <React.StrictMode>

        <ThemeProvider theme={theme}>

            <CssBaseline />

            <MachineProvider>

                <App />

            </MachineProvider>

        </ThemeProvider>

    </React.StrictMode>

);
