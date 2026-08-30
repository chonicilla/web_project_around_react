import { StrictMode, createElement } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./blocks/fonts.css";
import App from "./components/App.jsx";

createRoot(document.getElementById("root")).render(
  createElement(StrictMode, null, createElement(App)),
);
