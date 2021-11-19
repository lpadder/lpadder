import { Link, Routes } from "react-router-dom";
import { Fragment } from "react";

export default function UtilitiesHome () {
  return (
    <Fragment>
    <div>
      <h1>lpadder's Utilities</h1>
      <p>Here you'll find a lot of utilities around the Launchpad.</p>

      <ul>
        <li>
          <Link to="/utilities/ableton-parse">
            Parse Ableton Live Set (.als) file
          </Link>
        </li>
        <li>
          <Link to="/utilities/convert-midi-files">
            Convert your MIDI files to Launchpad's programmer or live layout.
          </Link>
        </li>
      </ul>
    </div>
    </Fragment>
  )
}
