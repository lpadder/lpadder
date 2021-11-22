import { Link } from "react-router-dom";
import LpadderLogo from "@/assets/icon.png";

const SubMenu = ({ title, description, to }) => {
  return (
    <Link to={to} className="flex-1">
      <div className="p-4 bg-blue-800 bg-opacity-40 rounded-md backdrop-filter backdrop-blur">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </Link>
  );
};

const LinkFooter = ({ content, link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer noopener"
      className=""
    >
      {content}
    </a>
  );
}

export default function Home () {
  return (
    <div className="
      bg-no-repeat bg-contain w-screen h-screen
      bg-home-mobile bg-bottom
      sm:bg-home-desktop sm:bg-right
      p-8
    ">

      <nav className="bg-transparent w-full h-36 flex flex-row sm:justify-start justify-center">
        <img className="h-24 w-24" alt="lpadder's logo" src={LpadderLogo} />
      </nav>

      <div className="flex flex-col flex-wrap items-center sm:items-start gap-4">
        <SubMenu
          title="Projects"
          description="Take a look to your saved projects !"
          to="/projects"
        />

        <SubMenu
          title="Utilities"
          description="Want to do some crazy stuff ?"
          to="/utilities"
        />
      </div>

      <footer className="absolute bottom-0 left-0 sm:left-auto sm:w-auto w-full h-24 flex items-center sm:justify-start justify-center">
        <p>Made with ❤️ by <LinkFooter content="Vexcited" link="https://github.com/Vexcited" />.</p>
      </footer>
    </div>
  )
}
