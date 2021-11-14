import React from "react";
import ReactDOM from "react-dom";
import "tailwindcss/tailwind.css";

import Router from "./components/Router";

// PWA Content Update
import ReloadPrompt from "./components/ReloadPrompt";

ReactDOM.render(
  <React.StrictMode>
    <Router />
    
    <ReloadPrompt />
  </React.StrictMode>,
  document.getElementById("root")
);
