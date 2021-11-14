import { Link } from "react-router-dom";

export default function ProjectNavigation () {
  return (
    <div className="">
      <Link to="edit">
        <button className="">Edit</button>
      </Link>
      <Link to="play">
        <button className="">Play</button>
      </Link>
      <Link to="informations">
        <button className="">Infomations</button>
      </Link>
    </div>
  );
}
