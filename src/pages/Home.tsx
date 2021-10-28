import { Link } from "react-router-dom";

export default function Home () {

  return (
    <div>
      <h1>Welcome to lpadder !</h1>

      <Link to="/utilities">Utilities</Link>
    </div>
  )
}