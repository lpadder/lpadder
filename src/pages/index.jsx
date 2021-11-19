import { Link } from "react-router-dom";

export default function Home () {
  return (
    <div className="
      bg-gray-800 bg-no-repeat bg-contain w-screen h-screen
      bg-home-mobile bg-bottom
      md:bg-home-desktop md:bg-right
    ">


      <img src="/apple-touch-icon.png" alt="lpadder's logo" />

      <div>
        <Link to="/projects">
          <h2>Projects</h2>
        </Link>
        <p>
          Play or edit any of your lpadder projects.
        </p>
      </div>

      <div>
        <Link to="/utilities">
          <h2>Utilities</h2>
        </Link>
        <p>
          Utilities like an Ableton project parser.
        </p>
      </div>
    </div>
  )
}
