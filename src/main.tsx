import React from "react";
import ReactDOM from "react-dom/client";

// Fonts
import "@fontsource/poppins/latin-300.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";

// TailwindCSS
import "@/styles/globals.css";

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

// Modals
import ReloadPrompt from "@/components/ReloadPrompt";
import ImportProjectModal from "@/components/ImportProjectModal";
import CreateProjectModal from "@/components/CreateProjectModal";
// import LpadderWrongVersionModal from "./components/LpadderWrongVersionModal";

import { enableAndSetup } from "@/utils/webmidi";

/** Mount point of the React app. */
const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element.");

// Create the root and render the app.
const root = ReactDOM.createRoot(container);
root.render(
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
    <ImportProjectModal />
    <CreateProjectModal />
  </React.StrictMode>
);

requestIdleCallback(() => enableAndSetup());