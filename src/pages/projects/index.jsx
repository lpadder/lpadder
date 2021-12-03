import { Link, Routes, Route, Outlet } from "react-router-dom";
import { Fragment } from "react";

import Informations from "./slug/informations";
import Play from "./slug/play";
import Edit from "./slug/edit";

const ProjectItem = ({ name, slug }) => {
  return (
    <div className="w-full h-8 bg-gray-600">


    </div>
  );
}

export default function Projects () {
  return (
    <Fragment>
      <Routes>
        <Route path=":slug" element={<Informations />} />
        <Route path=":slug/play" element={<Play />} />
        <Route path=":slug/edit" element={<Edit />} />
      </Routes>

      <div className="w-screen h-screen">
        <header className="fixed top-0 w-full bg-gray-900 bg-opacity-60 h-20 shadow flex justify-between items-center px-8">
          <Link to="/">
            Go Back
          </Link>
          <ul className="flex gap-4 flex-row-reverse">
            <li>Settings</li>
            <li>(Switch)</li>
          </ul>
        </header>
        
        {/** Projects Navigation */}
        <nav className="fixed top-0 left-0 h-full w-72 bg-gray-700 mt-20">
          <ProjectItem
            name="TestItem"
            slug="test-item"
          />
        </nav>
        
        <div className="w-full h-full pl-72 pt-20">
          <Outlet />
        </div>
      </div>
    </Fragment>
  )
}
