import { Link, Routes, Route, Outlet } from "react-router-dom";
import { Fragment, useState } from "react";

import Informations from "./slug/informations";
import Play from "./slug/play";
import Edit from "./slug/edit";

const ProjectItem = ({ name, slug }) => {
  const handleProjectUpdate = () => {
    console.log(slug);
  };

  return (
    <div
      onClick={handleProjectUpdate}
      className="w-full px-4 py-6 cursor-pointer bg-gray-700 hover:bg-gray-800 hover:bg-opacity-40 border-solid border-t-2 border-gray-800"
    >
      <h3 className="font-medium text-lg">{name}</h3>
      <span className="font-light text-md">{slug}</span>
    </div>
  );
};

export default function Projects() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Fragment>
      <Routes>
        <Route path=":slug" element={<Informations />} />
        <Route path=":slug/play" element={<Play />} />
        <Route path=":slug/edit" element={<Edit />} />
      </Routes>

      <div className="w-screen h-screen">
        <header className="fixed top-0 w-full bg-gray-900 bg-opacity-60 h-20 shadow flex justify-between items-center px-8">
          <div className="flex gap-2">
            <Link className="px-4 py-2 bg-blue-800 bg-opacity-40 hover:bg-opacity-80 transition-colors rounded" to="/">
              Go Back
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="px-4 py-2 md:hidden">
              Menu
            </button>
          </div>
          <ul className="flex gap-4 flex-row-reverse">
            <li>Settings</li>
          </ul>
        </header>

        {/** Projects Navigation */}
        <nav className={`${menuOpen ? "block" : "hidden"} md:block fixed h-full top-20 left-0 md:w-72 w-full bg-gray-700`}>
          {/** Import / Create */}
          <div className="w-auto px-4 h-12 flex justify-around items-center bg-gray-800 bg-opacity-60">
            <p>Import</p>
            <p>Create</p>
          </div>

          {/** Projects List */}
          <div className="fixed bottom-0 top-32 md:w-72 w-full overflow-auto">
            <ProjectItem name="TestItem" slug="test-item" />
            <ProjectItem name="TestItem" slug="test-item" />
            <ProjectItem name="TestItem" slug="test-item" />
            <ProjectItem name="TestItem" slug="test-item" />
            <ProjectItem name="TestItem" slug="test-item" />
            <ProjectItem name="TestItem" slug="test-item" />
            <ProjectItem name="TestItem" slug="test-item" />
            <ProjectItem name="TestItem" slug="test-item" />
            <ProjectItem name="TestItem" slug="test-item" />
            <ProjectItem name="TestItem" slug="test-item" />
          </div>
        </nav>

        <div className="w-full h-full pl-72 pt-20">
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
}
