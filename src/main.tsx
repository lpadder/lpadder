import React from "react";
import ReactDOM from "react-dom";

// Fonts
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";

// TailwindCSS
import "tailwindcss/tailwind.css";

// Routing
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route
} from "react-router-dom";

// Pages
import Home from "@/pages/index";
import Projects from "@/pages/projects/index";
import Utilities from "@/pages/utilities/index";

// PWA Content Update
import ReloadPrompt from "@/components/ReloadPrompt";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/projects/*" element={<Projects />} />
        <Route path="/utilities/*" element={<Utilities />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    
    <ReloadPrompt />
  </React.StrictMode>,
  document.getElementById("root")
);
