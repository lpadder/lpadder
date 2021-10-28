import { Link } from "react-router-dom";

export default function UtilitiesHome () {
  return (
    <div>
      <h1>lpadder's Utilities</h1>
      <p>Here you'll find a lot of utilities around the Launchpad.</p>

      <ul>
        <li>
          <Link to="/utilities/ableton-parse">
            Parse Ableton Live Set (.als) file
          </Link>
        </li>
      </ul>
    </div>
  )
}