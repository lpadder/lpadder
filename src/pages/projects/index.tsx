import { ProjectStoredStructure, ProjectStructure } from "@/types/Project";

import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import React, { Fragment, useState, useEffect } from "react";
import create from "zustand";
import JSZip from "jszip";

import stores from "@/stores";
import exportCoverToZip from "@/utils/exportCoverToZip";

// Components in the layout.
import ProjectOverview from "@/pages/projects/slug/index";
import ImportProjectModal from "@/components/ImportProjectModal";
import CreateProjectModal from "@/components/CreateProjectModal";
import DropdownButton from "@/components/DropdownButton";
import FullLoader from "@/components/FullLoader";

// Icons
import { HiShare, HiOutlineDotsVertical } from "react-icons/hi";
import { IoMdArrowBack, IoMdMenu } from "react-icons/io";

export type ProjectsStore = {
  allLocalProjects: ProjectStoredStructure[] | null;
  setAllLocalProjects: (data: ProjectStoredStructure[]) => void;

  projectToImport: ProjectStructure | null;
  setProjectToImport: (data: ProjectStructure | null) => void;
}

export const useProjectsStore = create<ProjectsStore>(set => ({
  allLocalProjects: null,
  setAllLocalProjects: (data) => set(() => ({ allLocalProjects: data })),

  projectToImport: null,
  setProjectToImport: (data) => set(() => ({ projectToImport: data }))
}));

export default function Projects () {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const [currentProjectSlug, setCurrentProjectSlug] = useState<string | null>(null);

  const {
    allLocalProjects,
    setAllLocalProjects,
    setProjectToImport
  } = useProjectsStore(state => ({
    allLocalProjects: state.allLocalProjects,
    setAllLocalProjects: state.setAllLocalProjects,
    setProjectToImport: state.setProjectToImport
  }));
  
  type ProjectItemProps = { name: string; slug: string; selected: boolean; };
  const ProjectItem = ({ name, slug, selected = false }: ProjectItemProps) => {
    const navigate = useNavigate();
  
    const handleProjectUpdate = () => {
      setCurrentProjectSlug(slug);
      navigate(slug);
    };
  
    return (
      <div
        onClick={handleProjectUpdate}
        className={`
          flex flex-row items-center justify-between
          w-full px-4 py-6 cursor-pointer
          ${selected ? "bg-gray-600" : "bg-gray-700"}
          hover:bg-gray-800 hover:bg-opacity-40
          border-solid border-t-2 border-gray-800
        `}
      >
        <div>
          <h3 className="text-lg font-medium">{name}</h3>
          <span className="font-light text-md">{slug}</span>
        </div>
        <DropdownButton
          buttonClassName="p-2 rounded-lg transition-colors hover:bg-opacity-40 hover:bg-gray-900 cursor-pointer"
          items={[
            {
              name: "Delete",
              action: async () => {
                const wasRemoved = await stores.projects.deleteProject(slug);
                if (!wasRemoved) return;

                const allLocalProjectsUpdated = [ ...allLocalProjects as ProjectStoredStructure[] ];
                setAllLocalProjects([
                  ...allLocalProjectsUpdated.filter(e => e.slug !== slug)
                ]);

                // If the current project was removed, we redirect
                // to root because project will be inexistant.
                // Also remove the useless components.
                if (currentProjectSlug === slug) {
                  navigate("/projects");
                  
                  setMenuComponents([]);
                  setCurrentProjectSlug(null);
                }
              }
            }
          ]}
        >
          <HiOutlineDotsVertical size={24} />
        </DropdownButton>
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

  /**
   * On page load, we take every cover in the localForage
   * and we store it in a global state that'll be shared
   * with children components.
   * 
   * We also check if a project slug was specified.
   */
  useEffect(() => {
    (async () => {
      console.group("[/][useEffect]");
      console.info("⌛ Fetching every stored projects...");

      const allStorageProjects = await stores.projects.getStoredProjects();
      setAllLocalProjects(allStorageProjects);

      console.info(
        "✔️ Stored every projects in local state: 'allLocalProjects' !"
      );

      // Check if we have selected a project from URL.
      // For showing it in navigation bar.
      const urlProjectSlug = location.pathname
        .replace(/\/projects\//g, "");

      // Check if the project's slug exists.
      const urlProjectSlugFound = allStorageProjects.find(
        project => project.slug === urlProjectSlug
      );

      // If the project is found from slug.
      if (urlProjectSlugFound) {
        const accourateProjectSlug = urlProjectSlugFound.slug;

        console.info("→ Found matching project from slug in URL: ", accourateProjectSlug);
        console.groupEnd();

        // Save slug in state.
        setCurrentProjectSlug(accourateProjectSlug);
      }
      else console.groupEnd();
    })();
  }, []);
  
  /** Open CreateProjectModal when creating a new cover. */
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const handleCreateCover = () => setCreateProjectModalOpen(true);

  const [importProjectModalOpen, setImportProjectModalOpen] = useState(false);
  const handleImportCover = () => {
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("hidden", "true");
    
    // Only accept ".zip" files.
    fileInput.setAttribute("accept", ".zip");
    
    fileInput.addEventListener("change", () => {
      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const zip_content = await JSZip.loadAsync(arrayBuffer);

        const coverDataFile = zip_content.file("cover.json");
        if (!coverDataFile) return console.error(
          "This file doesn't contain a `cover.json` file in root directory."
        );

        const coverData = await coverDataFile.async("string");
        const parsedCoverData: ProjectStructure = JSON.parse(coverData);

        /**
         * `next` version is when the project was created using
         * lpadder in a development envrionment (`yarn dev`).
         */
        const { version } = parsedCoverData;
        if (
          // version !== "next" &&
          version !== "0.0.2"
        ) { 
          // TODO: Show a modal to warn the user that the project isn't supported.
          console.warn(
            "This project was created with a different version of lpadder. " +
              "It's not possible to import this project."
          );
              
          const release_url = `https://api.github.com/repos/Vexcited/lpadder/releases/tags/v${version}`;
          const release_response = await fetch(release_url);

          const release_data = await release_response.json() as {
              assets: { name: string; browser_download_url: string; }[],
              id: string;

              // On error.
              message: string;
            };

          if (!release_data.id) return console.error(
            release_data.message
          );

          const assets = release_data.assets;
          const deploy_url_asset = assets.find(
            asset => asset.name === "url.txt"
          );

          if (!deploy_url_asset) return console.error(
            `Couldn't find 'url.txt' asset in v${version} release.`
          );

          const deploy_url_response = await fetch(deploy_url_asset.browser_download_url);
          console.log("deploy_url", deploy_url_response);

          return;
        }

        setProjectToImport(parsedCoverData);
        setImportProjectModalOpen(true);
      };
      
      const files = fileInput.files;
      if (files && files.length > 0) {
        reader.readAsArrayBuffer(files[0]);
      }
    });

    // Add the input to the DOM.
    document.body.append(fileInput);
    
    // Click the input to import a file.
    fileInput.click();
    fileInput.remove();
  };

  // State for components in header that can be updated from
  // children pages.
  const [menuComponents, setMenuComponents] = useState<JSX.Element[]>([]);

  /** Show a loader while the projects are loading. */
  if (!allLocalProjects) return <FullLoader
    loadingText="Loading your saved projects..."
  />;

  return (
    <Fragment>
      <CreateProjectModal
        open={createProjectModalOpen}
        closeModal={() => setCreateProjectModalOpen(false)}
      />

      <ImportProjectModal
        open={importProjectModalOpen}
        closeModal={() => setImportProjectModalOpen(false)}
      />

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

          {currentProjectSlug &&
            <ul className="flex flex-row-reverse gap-4">
              <HeaderItem>
                <DropdownButton
                  buttonClassName="p-2 transition-colors hover:bg-pink-800 hover:bg-opacity-20 text-gray-400 hover:text-pink-400 rounded cursor-pointer"
                  items={[
                    {
                      name: "Export to .zip",
                      action: async () => await exportCoverToZip(currentProjectSlug)
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
          }
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
            {allLocalProjects.length > 0
              ? <Fragment>
                {allLocalProjects.map(project =>
                  <ProjectItem
                    key={project.slug}
                    slug={project.slug}
                    name={project.data.name}
                    selected={project.slug === currentProjectSlug}
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

            <Route
              index
              element={<NoCoverSelectedPage />}
            />
          </Routes>
        </div>
      </div>
    </Fragment>
  );
}

const NoCoverSelectedPage = () => {
  return (
    <main
      className="flex flex-col justify-center items-center w-full h-full"
    >
      <div
        className="flex flex-col gap-4 justify-center items-center max-w-md text-sm sm:text-base md:w-96"
      >
        <h2
          className="text-2xl font-medium text-gray-200"
        >
          No project selected !
        </h2>
        <p className="p-4 mx-4 text-center text-gray-400 bg-gray-900 bg-opacity-60 rounded-lg">
          Take a look at the menu and select, create or import a project; then play or edit the project as you want !
        </p>

      </div>
    </main>
  );
};