/* @refresh reload */
import "@fontsource/poppins/latin-300.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@/styles/globals.css";
import "virtual:windi.css";

import { MetaProvider } from "@solidjs/meta";
import { render } from "solid-js/web";
import routes from "~solid-pages";

import FullLoader from "@/components/FullLoader";
import WebMidiErrorModal from "@/components/modals/WebMidiErrorModal";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import ImportProjectModal from "@/components/modals/ImportProjectModal";
import LpadderUpdaterModal from "@/components/modals/LpadderUpdaterModal";

import { enableAndSetup } from "@/utils/webmidi";
import { webMidiInformations } from "@/stores/webmidi";

export default function RootRender () {
  const Routes = useRoutes(routes);
  onMount(() => enableAndSetup());

  return (
    <MetaProvider>
      <Router>
        <Show
          when={webMidiInformations.wasRequested}
          fallback={<FullLoader message="Requesting WebMIDI..." />}
        >
          <LpadderUpdaterModal />
          <WebMidiErrorModal />

          <ImportProjectModal />
          <CreateProjectModal />

          <Suspense
            fallback={<FullLoader message="Loading route..." />}
          >
            <Routes />
          </Suspense>
        </Show>
      </Router>
    </MetaProvider>
  );
}

render(
  () => <RootRender />,
  document.getElementById("root") as HTMLDivElement
);
