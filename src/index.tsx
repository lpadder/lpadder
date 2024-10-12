/* @refresh reload */
import "@fontsource/poppins/latin-300.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@/styles/globals.css";
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

import { MetaProvider } from "@solidjs/meta";
import { Toaster } from "solid-toast";
import { render } from "solid-js/web";
import routes from "~solid-pages";

import FullLoader from "@/components/FullLoader";
import WebMidiErrorModal from "@/components/modals/WebMidiErrorModal";
import LpadderUpdater from "@/components/LpadderUpdater";

import { enableAndSetup } from "@/utils/webmidi";
import { webMidiInformations } from "@/stores/webmidi";

export default function RootRender () {
  onMount(() => enableAndSetup());

  return (
    <>
      <LpadderUpdater />
      <Toaster position="bottom-right" toastOptions={{
        className: "!bg-slate-900 !text-slate-200"
      }} />

      <Router root={(props) => (
        <MetaProvider>
          <Title>lpadder</Title>
          <Show
            when={webMidiInformations.wasRequested}
            fallback={<FullLoader message="Requesting WebMIDI..." />}
          >
            <WebMidiErrorModal />

            <Suspense
              fallback={<FullLoader message="Loading route..." />}
            >
              {props.children}
            </Suspense>
          </Show>
        </MetaProvider>
      )}>
        {routes}
      </Router>
    </>
  );
}

render(
  () => <RootRender />,
  document.getElementById("root") as HTMLDivElement
);
