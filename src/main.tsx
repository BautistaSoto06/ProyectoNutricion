import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { clarity } from "react-microsoft-clarity";
import "./index.css";
import App from "./App";

const clarityId = import.meta.env.VITE_CLARITY_ID;
if (clarityId) {
  clarity.init(clarityId);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
