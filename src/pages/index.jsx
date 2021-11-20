import { Link } from "react-router-dom";
import LpadderLogo from "@/assets/icon.png";

export default function Home () {
  return (
    <div className="
      bg-no-repeat bg-contain w-screen h-screen
      bg-home-mobile bg-bottom
      sm:bg-home-desktop sm:bg-right
    ">

      <nav className="bg-transparent w-screen h-36 flex flex-row sm:justify-start justify-center">
        <div className="p-8">
          <img className="h-full w-auto" alt="lpadder's logo" src={LpadderLogo} />
        </div>
      </nav>

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
