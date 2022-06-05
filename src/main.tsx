/* @refresh reload */
import "@fontsource/poppins/latin-300.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@/styles/globals.css";

import { Component, onMount, Suspense } from "solid-js";

import { render } from "solid-js/web";
import { lazy } from "solid-js";

import {
  Navigate,
  Router,
  Routes,
  Route
} from "solid-app-router";

// Pages
const Home                 = lazy(() => import("@/pages/index"));
// const Projects  = lazy(() => import("@/pages/projects/index"));
const UtilitiesHome        = lazy(() => import("@/pages/utilities/index"));
const UtilitiesConvertMidi = lazy(() => import("@/pages/utilities/convert-midi"));
const UtilitiesMidiChecker = lazy(() => import("@/pages/utilities/midi-checker"));

// Components
import UtilitiesHeader from "@/components/UtilitiesHeader";

// Modals
import LpadderUpdaterModal from "@/components/LpadderUpdaterModal";
// import ImportProjectModal from "@/components/ImportProjectModal";
// import CreateProjectModal from "@/components/CreateProjectModal";
// import LpadderWrongVersionModal from "./components/LpadderWrongVersionModal";

// WebMidi
import { enableAndSetup } from "@/utils/webmidi";
import { WebMidiProvider } from "@/contexts/webmidi";

const Main: Component = () => {
  // Enable WebMidi when app is initialized.
  onMount(() => enableAndSetup());

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        
          {/* <Route path="/projects/*" element={<Projects />} />*/}

          <Route path="/utilities" element={<UtilitiesHeader />}>
            <Route path="/" element={<UtilitiesHome />} />
            <Route path="*" element={<Navigate href="/utilities" />} />

            <Route path="/convert-midi" element={<UtilitiesConvertMidi />} />
            <Route path="/midi-checker" element={<UtilitiesMidiChecker />} />
          </Route>

          <Route path="*" element={<Navigate href="/" />} />
        </Routes>

        {/* <ImportProjectModal />
      <CreateProjectModal /> */}
      
        <LpadderUpdaterModal />
      </Router>
    </Suspense>
  );
};

render(
  () => (
    <WebMidiProvider>
      <Main />
    </WebMidiProvider>
  ),
  document.getElementById("root") as HTMLDivElement
);
