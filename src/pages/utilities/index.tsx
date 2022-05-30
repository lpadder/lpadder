import type { Component } from "solid-js";

import { Routes, Route, Navigate, Link, useNavigate } from "solid-app-router";
import { lazy, Suspense, For } from "solid-js";

// Components
import FullLoader from "@/components/FullLoader";

// Utilities
// const AbletonParse   = lazy(() => import("./ableton-parse"));
const ConvertMidi    = lazy(() => import("./convert-midi"));
// const MidiChecker    = lazy(() => import("./midi-checker"));
// const MidiVisualizer = lazy(() => import("./midi-visualizer"));

// List all utilities available.
const utilities = [
  // {
  //   slug: "ableton-parse",
  //   description: "Parse Ableton Live Set (.als) file.",
  //   component: <AbletonParse />
  // },
  {
    slug: "convert-midi",
    description: "Convert your MIDI files to Launchpad's programmer or live layout.",
    element: ConvertMidi
  },
  // {
  //   slug: "midi-checker",
  //   description: "Connect your MIDI device and listen to it's IO. You can also send input to them.",
  //   component: <MidiChecker />
  // },
  // {
  //   slug: "midi-visualizer",
  //   description: "Parse any MIDI file and visualize it on an Launchpad. Useful when making lightshows.",
  //   component: <MidiVisualizer />
  // }
];

const UtilitiesHome: Component = () => {
  return (
    <div
      class="flex flex-col gap-12 justify-center items-center"
    >
      <div class="text-center">
        <h1
          class="text-3xl font-medium"
        >
          Welcome to the Utilities
        </h1>
        <p>Here you&apos;ll find a lot of utilities around the Launchpad and MIDI devices.</p>
      </div>

      <div
        class="max-w-[968px] grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <For each={utilities}>
          {({ slug, description }) => (
            <Link
              href={`/utilities/${slug}`}
              class="group p-4 rounded-lg w-full bg-gray-900 bg-opacity-20 shadow-gray-900/50 hover:bg-opacity-60 shadow-sm hover:shadow-lg transition cursor-pointer"
            >
              <h2
                class="transition-colors text-gray-400 group-hover:text-gray-200 font-medium text-xl mb-2"
              >
                {slug}
              </h2>
              <p
                class="transition-colors text-gray-400 text-opacity-60 group-hover:text-opacity-100"
              >
                {description}
              </p>
            </Link>
          )}
        </For>
      </div>
    </div>
  );
};

// Routes for `/utilities`.
const Utilities: Component = () => {
  const navigate = useNavigate();

  return (
    <div class="relative min-h-screen">
      <header
        class="flex justify-start items-center px-8 w-full h-24"
      >
        <button
          onClick={() => navigate(-1)}
          class="z-50 px-4 py-2 bg-gray-900 bg-opacity-60 rounded-lg transition-colors hover:bg-opacity-80"
        >
          Go back
        </button>
      </header>
      
      <main class="relative p-4 h-full">
        <Suspense fallback={<FullLoader message="Loading the utility..." />}>
          <Routes>
            <Route path="/" element={<UtilitiesHome />} />

            <For each={utilities}>
              {({ slug, element: Element }) => {
                console.log(slug); return (
                  <Route
                    path={`${slug}`}
                    element={<Element />} 
                  />
                );
              }}  
            </For>

            {/* <Route path="*all" element={<Navigate href="/utilities" />} /> */}
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default Utilities;