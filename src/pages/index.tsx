import { Link } from "react-router-dom";
import LpadderLogo from "@/assets/icon.png";

type SubMenuProps = {
  title: string;
  description: string;
  to: string;
};

const SubMenu = ({ title, description, to }: SubMenuProps) => {
  return (
    <Link to={to} className="flex-1">
      <div className="p-4 bg-gray-500 bg-opacity-40 rounded-md backdrop-filter backdrop-blur transition-colors hover:bg-opacity-60">
        <h2 className="text-xl font-medium text-blue-50">{title}</h2>
        <p className="font-thin text-blue-100 opacity-80">{description}</p>
      </div>
    </Link>
  );
};

export default function Home () {
  return (
    <div className="p-8 w-screen h-screen bg-bottom bg-no-repeat bg-contain bg-home-mobile sm:bg-home-desktop sm:bg-right">

      <nav className="flex flex-row justify-center w-full h-36 bg-transparent sm:justify-start">
        <img className="w-24 h-24" alt="lpadder's logo" src={LpadderLogo} />
      </nav>

      <div className="flex flex-col flex-wrap gap-4 items-center sm:items-start">
        <SubMenu
          title="Projects"
          description="Take a look at your saved projects !"
          to="/projects"
        />

        <SubMenu
          title="Utilities"
          description="Want to do some crazy stuff ?"
          to="/utilities"
        />
      </div>

      <footer className="flex fixed bottom-0 left-0 justify-center items-center w-full h-24 sm:justify-start sm:left-auto sm:w-auto">
        <p className="text-gray-200 text-opacity-80">
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
  );
}
