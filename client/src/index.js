import React from "react";
import App from "./components/App";
import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <LanguageProvider>
    <Router>
      <App />
    </Router>
  </LanguageProvider>
);
