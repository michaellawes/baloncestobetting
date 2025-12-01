import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./fonts/SFSportsNight/SFSportsNight.ttf";
import "./fonts/SFSportsNight/SFSportsNightUpright.ttf";
createRoot(document.getElementById("root")).render(_jsx(GoogleOAuthProvider, { clientId: import.meta.env.VITE_CLIENT_ID, children: _jsx(StrictMode, { children: _jsx(App, {}) }) }));
//# sourceMappingURL=main.js.map