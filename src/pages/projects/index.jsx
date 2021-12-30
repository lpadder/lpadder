import { Link, Routes, Route } from "react-router-dom";
import { Fragment, useState, useEffect } from "react";

import Informations from "./slug/informations";
import Play from "./slug/play";
import Edit from "./slug/edit";

import CreateProjectModal from "../../components/CreateProjectModal";

import stores from "../../stores";

import { HiCog } from "react-icons/hi";

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

const NavbarItem = ({ children, ...props }) => {
  return (
    <button className="font-medium w-full transition-colors hover:bg-gray-100 hover:bg-opacity-10 hover:shadow-sm backdrop-blur-md mx-4 py-1 rounded" {...props}>
      {children}
    </button>
  );
};

const HeaderItem = ({ children }) => {
  return (
    <li className="flex justify-center items-center">
      {children}
    </li>
  )
}

export default function Projects() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  /** Saved projects are fetched and stored into . */
  const [savedProjects, setSavedProjects] = useState([]);
  async function reloadSavedProjects () {
    /** Debug */ console.info("Reloading saved projects in localforage.");
    /** Debug */ console.info("[OldState: 'savedProjects']", savedProjects);
    
    const projects = await stores.projects.getStoredProjects();
    setSavedProjects(projects);
    
    /** Debug */ console.info("[NewState: 'savedProjects']", projects);
  }
  
  useEffect(() => {
    reloadSavedProjects();
  }, []);
  
  /** Open CreateProjectModal when creating a new cover. */
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const handleCreateCover = () => setCreateProjectModalOpen(true);

  const handleImportCover = async () => {
    console.log("Importing is currently not supported !");
  }

  return (
    <Fragment>
      {createProjectModalOpen
        && <CreateProjectModal
          reloadSavedProjects={reloadSavedProjects}
          closeModal={() => setCreateProjectModalOpen(false)}
        />
      }

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
            <HeaderItem>
              <button title="Settings" onClick={() => setSettingsOpen(!settingsOpen)}>
                <HiCog size={32} />
              </button>
            </HeaderItem>
          </ul>
        </header>

        {/** Projects Navigation */}
        <nav className={`${menuOpen ? "block" : "hidden"} md:block fixed h-full top-20 left-0 md:w-72 w-full bg-gray-700`}>
          {/** Import / Create */}
          <div className="w-auto h-12 flex justify-around items-center bg-gradient-to-r from-blue-600 to-pink-600">
            <NavbarItem onClick={handleImportCover}>
              Import
            </NavbarItem>
            <NavbarItem onClick={handleCreateCover}>
              Create
            </NavbarItem>
          </div>

          {/** Projects List */}
          <div className="fixed bottom-0 top-32 md:w-72 w-full overflow-auto">
            {savedProjects.length > 0
              ? <Fragment>
                  {savedProjects.map((project) =>
                    <ProjectItem
                    name={project.data.name}
                    slug={project.slug}
                      key={project.slug}
                      />
                      )}
                </Fragment>
              : <div className="flex flex-col h-full items-center justify-center px-4 gap-8">
                  <p className="font-medium text-lg">
                    Nothing to play here...
                  </p>
                  <div className="flex flex-col gap-4 justify-center items-center">
                    <button
                      className="font-medium px-4 py-2 border-2 border-pink-600 bg-pink-600 bg-opacity-20 rounded"
                      onClick={handleCreateCover}
                    >
                      Create a new cover !
                    </button>
                    <span>OR</span>
                    <button
                      className="font-medium px-4 py-2 border-2 border-blue-600 bg-blue-600 bg-opacity-20 rounded"
                      onClick={handleImportCover}
                    >
                      Import a lpadder cover
                    </button>
                  </div>
                </div>
              }
          </div>
        </nav>

        <div className="w-full h-full pl-72 pt-20">
          <Routes>
            <Route path=":slug" element={<Informations />} />
            <Route path=":slug/play" element={<Play />} />
            <Route path=":slug/edit" element={<Edit />} />
          </Routes>
        </div>
      </div>
    </Fragment>
  );
}
