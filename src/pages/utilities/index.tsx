import { Routes, Route, Navigate, Link } from "react-router-dom";
import { lazy, Suspense } from "react";

import UtilitiesHeader from "@/components/UtilitiesHeader";
import FullLoader from "@/components/FullLoader";

// Utilities Routes.
const AbletonParse = lazy(() => import("./ableton-parse"));
const ConvertMidi = lazy(() => import("./convert-midi"));
const MidiChecker = lazy(() => import("./midi-checker"));

// List all utilities available.
const utilities = [
  {
    slug: "ableton-parse",
    description: "Parse Ableton Live Set (.als) file."
  },
  {
    slug: "convert-midi",
    description: "Convert your MIDI files to Launchpad's programmer or live layout."
  },
  {
    slug: "midi-checker",
    description: "Connect your MIDI device and listen to it's IO. You can also send input to them."
  }
];

const UtilitiesHome = () => {
  return (
    <div
      className="flex flex-col gap-12 justify-center items-center"
    >
      <div className="text-center">
        <h1
          className="text-3xl font-medium"
        >
          Welcome to the Utilities
        </h1>
        <p>Here you&apos;ll find a lot of utilities around the Launchpad and MIDI devices.</p>
      </div>

      <div
        className="max-w-[968px] grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {utilities.map(utility => (
          <Link
            to={utility.slug}
            className="group p-4 rounded-lg w-full bg-gray-900 bg-opacity-20 shadow-gray-900/50 shadow-none hover:bg-opacity-60 shadow-sm hover:shadow-lg transition cursor-pointer"
            key={utility.slug}
          >
            <h2
              className="transition-colors text-gray-400 group-hover:text-gray-200 font-medium text-xl mb-2"
            >
              {utility.slug}
            </h2>
            <p
              className="transition-colors text-gray-400 text-opacity-60 group-hover:text-opacity-100"
            >
              {utility.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Routes for `/utilities`.
export default function Utilities () {
  return (
    <div className="relative w-screen min-h-screen">
      <UtilitiesHeader />
      
      <main className="relative p-4 h-full">
        <Suspense fallback={<FullLoader loadingText="Loading the utility..." />}>
          <Routes>
            <Route index element={<UtilitiesHome />} />
            <Route path="ableton-parse" element={<AbletonParse />} />
            <Route path="convert-midi" element={<ConvertMidi />} />
            <Route path="midi-checker" element={<MidiChecker />} />

            <Route path="*" element={<Navigate to="/utilities" />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
