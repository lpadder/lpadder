/* eslint-disable solid/prefer-show */
/* @refresh reload */
import "@fontsource/poppins/latin-300.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@/styles/globals.css";
import "virtual:windi.css";

import { Links, Meta, Routes, Scripts } from "solid-start/root";
import { ErrorBoundary } from "solid-start/error-boundary";

import FullLoader from "@/components/FullLoader";
import WebMidiErrorModal from "@/components/WebMidiErrorModal";
import CreateProjectModal from "@/components/CreateProjectModal";
import ImportProjectModal from "@/components/ImportProjectModal";
import LpadderUpdaterModal from "@/components/LpadderUpdaterModal";

import { enableAndSetup } from "@/utils/webmidi";
import { webMidiInformations } from "@/stores/webmidi";

export default function RootRender () {
  onMount(() => enableAndSetup());

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0F172A" />

        {!import.meta.env.DEV && (
          <>
            <link rel="manifest" href="/manifest.webmanifest" />
            <script src="registerSW.js"></script>
          </>
        )}

        <Title>lpadder.</Title>
        <meta name="title" content="lpadder." />
        <meta name="description" content="Web application that lets you play Launchpad covers directly from your browser." />
        <link rel="canonical" href="https://lpadder.vexcited.ml/" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lpadder.vexcited.ml/" />
        <meta property="og:title" content="lpadder." />
        <meta property="og:description" content="Web application that lets you play Launchpad covers directly from your browser." />
        <meta property="og:image" content="/banner.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://lpadder.vexcited.ml/" />
        <meta property="twitter:title" content="lpadder." />
        <meta property="twitter:description" content="Web application that lets you play Launchpad covers directly from your browser." />
        <meta property="twitter:image" content="/banner.png" />

        <Meta />
        <Links />
      </head>
      <body class="overscroll-contain text-gray-300 bg-gray-800 select-none">
        <Show when={webMidiInformations.wasRequested} fallback={
          <FullLoader message="Requesting WebMIDI..." />
        }>
          {/** Internal related modals. */}
          <LpadderUpdaterModal />

          {/** Error modals. */}
          <WebMidiErrorModal />

          {/** Application modals. */}
          <ImportProjectModal />
          <CreateProjectModal />

          <ErrorBoundary>
            <Suspense fallback={<FullLoader message="Loading route..." />}>
              <Routes />
            </Suspense>
          </ErrorBoundary>
        </Show>

        <Scripts />
      </body>
    </html>
  );
}
