import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import UtilitiesHeader from "@/components/UtilitiesHeader";
import FullLoader from "@/components/FullLoader";

// Utilities Routes.
const AbletonParse = lazy(() => import("./ableton-parse"));
const ConvertMidi = lazy(() => import("./convert-midi"));

// List all utilities available.
const UtilitiesHome = () => {
  const navigate = useNavigate();

  const utilities = [
    {
      slug: "ableton-parse",
      description: "Parse Ableton Live Set (.als) file."
    },
    {
      slug: "convert-midi",
      description: "Convert your MIDI files to Launchpad's programmer or live layout."
    }
  ];

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
        <p>Here you&apos;ll find a lot of utilities around the Launchpad.</p>
      </div>

      <div
        className="w-full columns-2xs"
      >
        {utilities.map(utility => (
          <div
            onClick={() => navigate(utility.slug)}
            className="w-full bg-gray-900 bg-opacity-40 cursor-pointer"
            key={utility.slug}
          >
            <h2>
              {utility.slug}
            </h2>
            <p>
              {utility.description}
            </p>
          </div>
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

            <Route path="*" element={<Navigate to="/utilities" />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}