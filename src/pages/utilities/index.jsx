import { Link, Routes, Route } from "react-router-dom";
import { Fragment } from "react";

// Utilities Routes.
import AbletonParse from "./ableton-parse";
import ConvertMidi from "./convert-midi";

export default function Utilities () {
  return (
    <Fragment>
      <Routes>
        <Route path="ableton-parse" element={<AbletonParse />} />
        <Route path="convert-midi" element={<ConvertMidi />} />
      </Routes>

      <div>
        <h1>lpadder's Utilities</h1>
        <p>Here you'll find a lot of utilities around the Launchpad.</p>

        <ul>
          <li>
            <Link to="ableton-parse">
              Parse Ableton Live Set (.als) file
            </Link>
          </li>
          <li>
            <Link to="convert-midi">
              Convert your MIDI files to Launchpad's programmer or live layout.
            </Link>
          </li>
        </ul>
      </div>
    </Fragment>
  )
}
