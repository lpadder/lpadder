/* @refresh reload */
import "@fontsource/poppins/latin-300.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@/styles/globals.css";
import "virtual:windi.css";

import { FileRoutes, Scripts } from "solid-start/root";
import { Routes } from "@solidjs/router";
import { Suspense } from "solid-js";
import { Html, Head, Body } from "solid-start/root";
import { Meta, Link } from "@solidjs/meta";

import FullLoader from "@/components/FullLoader";
import WebMidiErrorModal from "@/components/modals/WebMidiErrorModal";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import ImportProjectModal from "@/components/modals/ImportProjectModal";
import LpadderUpdaterModal from "@/components/modals/LpadderUpdaterModal";

import { enableAndSetup } from "@/utils/webmidi";
import { webMidiInformations } from "@/stores/webmidi";

export default function RootRender () {
  onMount(() => enableAndSetup());

  return (
    <Html lang="en">
      <Head>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

        <Link rel="icon" href="/favicon.ico" sizes="any" />
        <Link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Meta name="theme-color" content="#0F172A" />

        <Link rel="manifest" href="/manifest.webmanifest" />

        <Title>lpadder.</Title>
        <Meta name="title" content="lpadder." />
        <Meta name="description" content="Web application that lets you play Launchpad covers directly from your browser." />
        <Link rel="canonical" href="https://www.lpadder.ml/" />

        <Meta property="og:type" content="website" />
        <Meta property="og:url" content="https://www.lpadder.ml/" />
        <Meta property="og:title" content="lpadder." />
        <Meta property="og:description" content="Web application that lets you play Launchpad covers directly from your browser." />
        <Meta property="og:image" content="/banner.png" />

        <Meta property="twitter:card" content="summary_large_image" />
        <Meta property="twitter:url" content="https://www.lpadder.ml/" />
        <Meta property="twitter:title" content="lpadder." />
        <Meta property="twitter:description" content="Web application that lets you play Launchpad covers directly from your browser." />
        <Meta property="twitter:image" content="/banner.png" />
      </Head>
      <Body class="overscroll-contain text-gray-300 bg-gray-800 select-none">
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
            <Routes>
              <FileRoutes />
            </Routes>
          </Suspense>
        </Show>

        <Scripts />
      </Body>
    </Html>
  );
}
