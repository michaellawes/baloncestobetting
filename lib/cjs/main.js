import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// @ts-expect-error TS 5.0+ is broken
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
createRoot(document.getElementById("root")).render(_jsx(GoogleOAuthProvider, { clientId: import.meta.env.VITE_CLIENT_ID, children: _jsx(StrictMode, { children: _jsx(App, {}) }) }));
//# sourceMappingURL=main.js.map