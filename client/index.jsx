import React from "react";
import ReactDOM from "react-dom/client"; // or 'react-dom' if older React
import App from "./App";
import "./index.css"; // make sure Tailwind CSS is imported here

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
