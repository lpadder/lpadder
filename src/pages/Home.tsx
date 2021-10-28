import { Link } from "react-router-dom";

export default function Home () {
  return (
    <div style={{
      textAlign: "center",
      padding: "2em"
    }}>
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
