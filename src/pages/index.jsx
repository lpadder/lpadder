import { Link } from "react-router-dom";

export default function Home () {
  return (
    <div className="
      bg-gray-800 text-gray-300
      bg-no-repeat bg-contain w-screen h-screen
      bg-home-mobile bg-bottom
      sm:bg-home-desktop sm:bg-right
    ">

      <div>
        <h2>Open a lpadder project</h2>
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
