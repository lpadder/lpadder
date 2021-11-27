import { Link } from "react-router-dom";
import LpadderLogo from "@/assets/icon.png";

const SubMenu = ({ title, description, to }) => {
  return (
    <Link to={to} className="flex-1">
      <div className="
        p-4 rounded-md
        bg-gray-500 bg-opacity-40
        hover:bg-opacity-60 transition-colors
        backdrop-filter backdrop-blur
      ">
        <h2 className="font-semibold text-xl text-blue-50">{title}</h2>
        <p className="text-blue-100 opacity-80">{description}</p>
      </div>
    </Link>
  );
};

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

      <footer className="
        w-full h-24
        absolute bottom-0 left-0
        flex items-center justify-center
        sm:justify-start sm:left-auto sm:w-auto
      ">
        <p className="
          backdrop-filter backdrop-blur
          text-gray-200 text-opacity-80
        ">
          Made with ❤️ by {" "}
          <a
            href="https://github.com/Vexcited"
            target="_blank"
            rel="noreferrer noopener"
            className="text-gray-200 text-opacity-90 hover:text-opacity-100"
          >
            Vexcited
          </a>
        </p>
      </footer>
    </div>
  )
}
