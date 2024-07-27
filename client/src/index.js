import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; //adding bootstrap css
import App from "./components/App";
import "./index.css";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
    , document.getElementById("root")
);
// const container = document.getElementById("root");
// const root = createRoot(container);
// root.render(<App />);
