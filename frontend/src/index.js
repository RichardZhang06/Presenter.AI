import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";  // Standard CSS file

const rootElement = document.getElementById("root");
if (!rootElement) {
    console.error("❌ Root element not found! Check your index.html file.");
} else {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
