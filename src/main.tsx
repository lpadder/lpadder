/* @refresh reload */
import "@fontsource/poppins/latin-300.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@/styles/globals.css";

import { Component, onMount, Show } from "solid-js";

import { render } from "solid-js/web";
import { lazy } from "solid-js";

import {
  Navigate,
  Router,
  Routes,
  Route
} from "solid-app-router";

// Components
import FullLoader from "@/components/FullLoader";

// Pages
const Home      = lazy(() => import("@/pages/index"));
// const Projects  = lazy(() => import("@/pages/projects/index"));
// const Utilities = lazy(() => import("@/pages/utilities/index"));

// Modals
import LpadderUpdatePrompt from "@/components/LpadderUpdatePrompt";
// import ImportProjectModal from "@/components/ImportProjectModal";
// import CreateProjectModal from "@/components/CreateProjectModal";
// import LpadderWrongVersionModal from "./components/LpadderWrongVersionModal";

// WebMidi
import { enableAndSetup } from "@/utils/webmidi";
import { webMidiStore } from "@/stores/webmidi";

const Main: Component = () => {
  onMount(() => enableAndSetup());

  return (
    <>
      <Show
        when={webMidiStore.wasRequested}
        fallback={<FullLoader message="Requesting webmidi..." />}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/projects/*" element={<Projects />} />
            <Route path="/utilities/*" element={<Utilities />} /> */}

            <Route path="*" element={<Navigate href="/" />} />
          </Routes>

          {/* <ImportProjectModal />
          <CreateProjectModal /> */}
        </Router>

      </Show>

      <LpadderUpdatePrompt />
    </>
  );
};

render(
  () => <Main />,
  document.getElementById("root") as HTMLDivElement
);
