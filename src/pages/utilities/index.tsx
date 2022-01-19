import { Link, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Utilities Routes.
const AbletonParse = lazy(() => import("./ableton-parse"));
const ConvertMidi = lazy(() => import("./convert-midi"));

// List of all utilities displayed on 404 utility or Home.
const UtilitiesHome = () => {
  return (
    <div>
      <h1>lpadder&apos;s Utilities</h1>
      <p>Here you&apos;ll find a lot of utilities around the Launchpad.</p>

      <ul>
        <li>
          <Link to="ableton-parse">
            Parse Ableton Live Set (.als) file
          </Link>
        </li>
        <li>
          <Link to="convert-midi">
            Convert your MIDI files to Launchpad&apos;s programmer or live layout.
          </Link>
        </li>
      </ul>
    </div>
  );
};

// Routes for `/utilities`.
export default function Utilities () {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="ableton-parse" element={<AbletonParse />} />
        <Route path="convert-midi" element={<ConvertMidi />} />
        <Route path="*" element={<UtilitiesHome />} />
      </Routes>
    </Suspense>
  );
}