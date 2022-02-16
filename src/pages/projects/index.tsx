import type { ProjectStoredStructure } from "@/types/Project";

import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import React, { Fragment, useState, useEffect } from "react";
import stores from "@/stores";

// Components in the layout.
import ProjectOverview from "@/pages/projects/slug/index";
import CreateProjectModal from "@/components/CreateProjectModal";
import DropdownButton from "@/components/DropdownButton";

// Icons
import { HiCog, HiShare } from "react-icons/hi";
import { IoMdArrowBack, IoMdMenu } from "react-icons/io";

export default function Projects () {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Used to style the currently selected cover.
  const [currentProject, setCurrentProject] = useState<string | null>(null);

  type ProjectItemProps = { name: string; slug: string; selected: boolean; };
  const ProjectItem = ({ name, slug, selected = false }: ProjectItemProps) => {
    const navigate = useNavigate();
  
    const handleProjectUpdate = () => {
      setCurrentProject(slug);
      navigate(`${slug}/play`);
    };
  
    return (
      <div
        onClick={handleProjectUpdate}
        className={`
          w-full px-4 py-6 cursor-pointer
          ${selected ? "bg-gray-600" : "bg-gray-700"}
          hover:bg-gray-800 hover:bg-opacity-40
          border-solid border-t-2 border-gray-800
        `}
      >
        <h3 className="text-lg font-medium">{name}</h3>
        <span className="font-light text-md">{slug}</span>
      </div>
    );
  };
  
  type NavbarItemProps = { children: React.ReactNode; onClick: () => void; };
  const NavbarItem = ({ children, onClick }: NavbarItemProps) => {
    return (
      <button
        onClick={onClick}
        className="py-1 mx-4 w-full font-medium rounded backdrop-blur-md transition-colors hover:bg-gray-100 hover:bg-opacity-10 hover:shadow-sm"
      >
        {children}
      </button>
    );
  };
  
  type HeaderItemProps = { children: React.ReactNode; };
  const HeaderItem = ({ children }: HeaderItemProps) => {
    return (
      <li className="flex justify-center items-center">
        {children}
      </li>
    );
  };

  /** Saved projects are fetched and stored into . */
  const [savedProjects, setSavedProjects] = useState<ProjectStoredStructure[]>([]);
  async function reloadSavedProjects () {
    /** Debug */ console.info("[OldState: 'savedProjects']", savedProjects);
    
    const projects = await stores.projects.getStoredProjects();
    setSavedProjects(projects);
    
    /** Debug */ console.info("[NewState: 'savedProjects']", projects);

    // Check if we have selected a project from URL.
    const urlProjectSlug = location.pathname
      .replace("/projects/", "")
      .replace(/(\/edit|\/play)/, "")
      .replace(/\//g, "");

    // Check if the project exists.
    const foundProject = projects.find(project => project.slug === urlProjectSlug);
    if (foundProject) {
      console.info("Found a matching project from slug in URL. Loading it...", foundProject);
      setCurrentProject(foundProject.slug);
    }
  }

  // Reload projects and check for URL project on load.
  useEffect(() => {
    reloadSavedProjects(); 
  }, []);
  
  /** Open CreateProjectModal when creating a new cover. */
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const handleCreateCover = () => setCreateProjectModalOpen(true);

  const handleImportCover = () => {
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("hidden", "");
    
    // Only accept ".zip" files.
    fileInput.setAttribute("accept", ".zip");
    
    fileInput.addEventListener("change", () => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        console.log("Imported file content.", arrayBuffer);
      };
      
      const files = fileInput.files;
      if (files && files.length > 0) {
        reader.readAsArrayBuffer(files[0]);
      }
      else {
        console.info("Import project file aborted.");
      }
    });

    // Add the input to the DOM.
    document.body.append(fileInput);
    
    // Click the input to import a file.
    fileInput.click();
    fileInput.remove();
  };

  // State for components in header that can be updated from
  // children pages. Using useEffect to debug the state.
  const [menuComponents, setMenuComponents] = useState<JSX.Element[]>([]);

  useEffect(() => {
    /** Debug */ console.info("[useEffect: 'menuComponents']", menuComponents);
  }, [menuComponents]);

  return (
    <Fragment>
      {createProjectModalOpen
        && <CreateProjectModal
          reloadSavedProjects={reloadSavedProjects}
          closeModal={() => setCreateProjectModalOpen(false)}
        />
      }

      <div
        className="w-screen h-screen"
        onContextMenu={(e) => e.preventDefault()}
      >
        <header
          className="flex fixed top-0 justify-between items-center px-8 w-full h-20 bg-gray-900 bg-opacity-60 shadow backdrop-blur"
        >
          <div className="flex gap-2">
            <Link className="p-2 text-gray-400 bg-blue-800 bg-opacity-20 rounded transition-colors hover:text-gray-200 hover:bg-opacity-60" to="/">
              <IoMdArrowBack size={28} />
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-400 bg-gray-600 bg-opacity-0 rounded transition-colors hover:text-gray-200 md:hidden hover:bg-opacity-20 focus:bg-opacity-40"
            >
              <IoMdMenu size={28} />
            </button>
          </div>

          <ul className="flex flex-row-reverse gap-4">
            <HeaderItem>
              <a
                onClick={() => console.info("Settings")}
                className="p-2 text-gray-400 rounded transition-colors cursor-pointer hover:bg-blue-800 hover:bg-opacity-20 hover:text-blue-400"
              >
                <HiCog size={28} />
              </a>
            </HeaderItem>
            <HeaderItem>
              <DropdownButton
                buttonClassName="p-2 transition-colors hover:bg-pink-800 hover:bg-opacity-20 text-gray-400 hover:text-pink-400 rounded cursor-pointer"
                menuClassName="bg-opacity-20 bg-gray-600 backdrop-blur-md"
                itemActiveClassName="bg-gray-600 bg-opacity-60"
                itemClassName="bg-gray-600 bg-opacity-40"
                items={[
                  {
                    name: "Export to .zip",
                    action: () => console.info("Export to .zip")
                  },
                  {
                    name: "Collaborate online",
                    action: () => console.info("Collaborate")
                  },
                ]}
              >
                <HiShare size={28} />
              </DropdownButton>
            </HeaderItem>
            {menuComponents.length > 0
              && menuComponents.map((component, key) =>
                <HeaderItem key={key}>
                  {component}
                </HeaderItem>
              )
            }
          </ul>
        </header>

        {/** Projects Navigation */}
        <nav className={`${menuOpen ? "block" : "hidden"} md:block fixed h-full top-20 left-0 md:w-72 w-full bg-gray-700`}>
          {/** Import / Create */}
          <div className="flex justify-around items-center w-auto h-12 bg-gradient-to-r from-blue-600 to-pink-600">
            <NavbarItem onClick={handleImportCover}>
              Import
            </NavbarItem>
            <NavbarItem onClick={handleCreateCover}>
              Create
            </NavbarItem>
          </div>

          {/** Projects List */}
          <div className="overflow-auto fixed bottom-0 top-32 w-full md:w-72">
            {savedProjects.length > 0
              ? <Fragment>
                {savedProjects.map((project) =>
                  <ProjectItem
                    name={project.data.name}
                    slug={project.slug}
                    selected={project.slug === currentProject}
                    key={project.slug}
                  />
                )}
              </Fragment>
              : <div className="flex flex-col gap-8 justify-center items-center px-4 h-full">
                <p className="text-lg font-medium">
                    Nothing to play here...
                </p>
                <div className="flex flex-col gap-4 justify-center items-center">
                  <button
                    className="px-4 py-2 font-medium bg-pink-600 bg-opacity-20 rounded border-2 border-pink-600"
                    onClick={handleCreateCover}
                  >
                      Create a new cover !
                  </button>
                  <span>OR</span>
                  <button
                    className="px-4 py-2 font-medium bg-blue-600 bg-opacity-20 rounded border-2 border-blue-600"
                    onClick={handleImportCover}
                  >
                      Import a lpadder cover
                  </button>
                </div>
              </div>
            }
          </div>
        </nav>

        <div className="pt-20 w-full h-full md:pl-72">
          <Routes>
            <Route
              path=":slug/*"
              element={
                <ProjectOverview
                  updateMenuComponents={setMenuComponents}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Fragment>
  );
}
