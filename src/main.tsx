import React from "react";
import ReactDOM from "react-dom";

// Style
import "./index.css";

// App Structure
import ReloadPrompt from "./components/ReloadPrompt";
import Router from "./components/Router";

ReactDOM.render(
  <React.StrictMode>
    <Router />
    
    <ReloadPrompt />
  </React.StrictMode>,
  document.getElementById("root")
);
