import type { ProjectStructure, ProjectLoadedMetadata } from "@/types/Project";

import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import React, { Fragment, useState, useEffect, useRef } from "react";
import JSZip from "jszip";

import exportCurrentCoverToZip from "@/utils/exportCurrentCoverToZip";
import checkProjectVersion from "@/utils/checkProjectVersion";

// Components in the layout.
import ProjectOverview from "@/pages/projects/slug/index";
import LpadderWrongVersionModal, {
  LpadderWrongVersionModalData
} from "@/components/LpadderWrongVersionModal";
import DropdownButton from "@/components/DropdownButton";
import FullLoader from "@/components/FullLoader";

import {
  storedProjectsMetadata,
  useLocalProjectsStore
} from "@/stores/projects_metadata";

import {
  syncDataGlobally,
  useCurrentProjectStore
} from "@/stores/current_project";

import { useModalsStore } from "@/stores/modals";
import shallow from "zustand/shallow";

// Icons
import { HiShare, HiOutlineDotsVertical } from "react-icons/hi";
import { IoMdArrowBack, IoMdMenu, IoMdSave } from "react-icons/io";

export default function Projects () {
  const projectMenuRef = useRef<HTMLDivElement | null>(null);
  const projectSaveButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuBarComponentsRef = useRef<HTMLUListElement | null>(null);

  const showMenuBarComponents = (visible: boolean) => {
    /** Debug */ console.info("[showMenuBarComponents]:", visible);

    const components = menuBarComponentsRef.current;
    if (!components) return;

    components.classList.toggle("flex", visible);
    components.classList.toggle("hidden", !visible);
  };

  const location = useLocation();

  // Load the projects metadata store.
  const {
    localProjectsMetadata,
    setLocalProjectsMetadata
  } = useLocalProjectsStore(state => ({
    localProjectsMetadata: state.localProjectsMetadata,
    setLocalProjectsMetadata: state.setLocalProjectsMetadata
  }), shallow);

  // Load the modals store.
  const {
    setCreateProjectModalVisibility,
    setImportProjectModalVisibility,
    setImportProjectModalData
  } = useModalsStore(state => ({
    setCreateProjectModalVisibility: state.setCreateProjectModal,
    setImportProjectModalVisibility: state.setImportProjectModal,
    setImportProjectModalData: state.setImportProjectModalData
  }), shallow);

  const project = useCurrentProjectStore(state => ({
    setSlug: state.setSlug,
    setIsGloballySaved: state.setIsGloballySaved,
    setData: state.setData,
    setMetadata: state.setMetadata
  }), shallow);

  type ProjectItemProps = { name: string; slug: string; selected: boolean; };
  const ProjectItem = ({ name, slug, selected = false }: ProjectItemProps) => {
    const navigate = useNavigate();
  
    const handleProjectUpdate = () => {
      if (project_slug.current === slug) return;
      console.info("[handleProjectUpdate] Switching from", project_slug.current, "to", slug);

      // We remove any currently opened project.
      project.setIsGloballySaved(true);
      project.setData(null);
      project.setMetadata(null);
      console.info("[handleProjectUpdate] Project data and metadata cleared.");

      // We update the current project slug
      // and navigate to its page to load it.
      project.setSlug(slug);
      navigate(slug);
      console.info("[handleProjectUpdate] Project slug updated and navigated to route.");
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
                const wasRemoved = await storedProjectsMetadata.deleteProjectMetadata(slug);
                if (!wasRemoved) return;

                const localProjectsUpdated = [ ...localProjectsMetadata as ProjectLoadedMetadata[] ];
                setLocalProjectsMetadata([
                  ...localProjectsUpdated.filter(
                    project => project.slug !== slug
                  )
                ]);

                // If the current project was removed, we redirect
                // to root because project will be inexistant.
                // Also remove the useless components.
                if (project_slug.current === slug) {
                  navigate("/projects");
                  
                  // We remove any currently opened project.
                  project.setIsGloballySaved(true);
                  project.setData(null);
                  project.setMetadata(null);
                  project.setSlug(null);
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
      console.info("⌛ Fetching every stored projects' metadatas...");

      const projects_metadatas = await storedProjectsMetadata.getProjectsMetadata();
      setLocalProjectsMetadata(projects_metadatas);

      console.info(
        "✔️ Stored every projects' metadatas in local store: 'localProjectsMetadata' !"
      );

      // Check if we have selected a project from URL.
      // For showing it in navigation bar.
      const urlProjectSlug = location.pathname
        .replace(/\/projects\//g, "");

      // Check if the project's slug exists.
      const urlProjectSlugFound = projects_metadatas.find(
        project => project.slug === urlProjectSlug
      );

      // If the project is found from slug.
      if (urlProjectSlugFound) {
        const accurateProjectSlug = urlProjectSlugFound.slug;

        console.info("→ Found matching project from slug in URL: ", accurateProjectSlug);
        console.groupEnd();

        // Save slug in state.
        project.setSlug(accurateProjectSlug);
      }
      else console.groupEnd();
    })();

    return () => {
      console.group("[/][useEffect] Cleanup...");

      console.info("⌛ Clearing local projects' metadata...");
      setLocalProjectsMetadata(null);
      
      console.info("⌛ Clearing current project store...");
      project.setIsGloballySaved(true);
      project.setData(null);
      project.setMetadata(null);
      project.setSlug(null);
      
      console.info("✔️ Done !");
      console.groupEnd();
    };
  }, []);

  const project_slug = useRef(useCurrentProjectStore.getState().slug);

  useEffect(() => {
    const platform = navigator.userAgentData?.platform || navigator.platform;
    const saveShortcut = (e: KeyboardEvent) => {
      if (e.key === "s" && (platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();

        const current_project = useCurrentProjectStore.getState();

        // Do nothing if project is already saved globally.
        if (current_project.isGloballySaved) return;

        console.info(`[CTRL+S] Save for ${current_project.slug}.`);
        syncDataGlobally();
      }
    };

    const unsubcribe = useCurrentProjectStore.subscribe(state => {
      project_slug.current = state.slug;

      if (!state.slug) {
        showMenuBarComponents(false);
      }
      else {
        showMenuBarComponents(true);

        // Configure shortcuts. 
        document.addEventListener("keydown", saveShortcut);
        console.info("[/][useEffect][CTRL+S] Configured shortcut.");
      }
    
      /** Show the save button only when project isn't globally saved. */
      if (!projectSaveButtonRef.current) return; 
      projectSaveButtonRef.current.classList.toggle("hidden", !state.isGloballySaved);
    });

    return () => {
      console.info("[/][useEffect][stores] Clean-up.");
      showMenuBarComponents(false);

      document.removeEventListener("keydown", saveShortcut);
      console.info("[/][useEffect][CTRL+S] Unconfigured shortcut.");

      return unsubcribe();
    };
  }, []);


  // useEffect(() => {
  //   // if (!projectSaveButtonRef.current) return; 

  //   console.info("[Event: globally_saved]:", globally_saved.current);

  //   return () => {
  //     console.info("[Event: globally_saved] Unmounting...");
  //   };

  //   // projectSaveButtonRef.current.classList.toggle("hidden", !globally_saved.current);
  // }, [globally_saved.current]);
  
  const default_lpadderWrongVersionModalData: LpadderWrongVersionModalData = {
    requiredVersion: APP_VERSION,
    errorMessage: undefined,
    lpadderDeployUrl: undefined
  };

  const [lpadderWrongVersionModalData, setLpadderWrongVersionModalData] = useState<LpadderWrongVersionModalData>(default_lpadderWrongVersionModalData);
  const [lpadderWrongVersionModalOpen, setLpadderWrongVersionModalOpen] = useState(false);

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

        // We check if the project version is matching
        // with lpadder's one - except on development.
        const { version } = parsedCoverData.metadata;
        const version_data = await checkProjectVersion(version);
        if (!version_data.success) {
          setLpadderWrongVersionModalData({
            requiredVersion: version,
            errorMessage: version_data.error_message,
            lpadderDeployUrl: version_data.deploy_url
          });

          setLpadderWrongVersionModalOpen(true);
          return; // We stop here.
        }

        setImportProjectModalData(parsedCoverData);
        setImportProjectModalVisibility(true);
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

  /** Show a loader while the projects are loading. */
  if (!localProjectsMetadata) {
    /** Debug */ console.info("[RENDER][/] Loading metadatas of projects...");

    return (
      <FullLoader
        loadingText="Loading your saved projects..."
      />
    );
  }
  
  /** Debug */ console.info(
    "[RENDER][/] Re-render because of metadata update.", localProjectsMetadata
  );

  return (
    <Fragment>
      <LpadderWrongVersionModal
        open={lpadderWrongVersionModalOpen}
        closeModal={() => setLpadderWrongVersionModalOpen(false)}

        lpadderDeployUrl={lpadderWrongVersionModalData.lpadderDeployUrl}
        requiredVersion={lpadderWrongVersionModalData.requiredVersion}
        errorMessage={lpadderWrongVersionModalData.errorMessage}
      />

      <div
        className="w-screen h-screen"
        onContextMenu={(e) => /** Prevent context menu. */ e.preventDefault()}
      >
        <header
          className="flex fixed top-0 justify-between items-center px-8 w-full h-20 bg-gray-900 bg-opacity-60 shadow backdrop-blur"
        >
          <div className="flex gap-2">
            <Link className="p-2 text-gray-400 bg-blue-800 bg-opacity-20 rounded transition-colors hover:text-gray-200 hover:bg-opacity-60" to="/">
              <IoMdArrowBack size={28} />
            </Link>
            <button
              onClick={() => {
                if (projectMenuRef.current)
                  projectMenuRef.current.classList.toggle("hidden");
              }}
              className="p-2 text-gray-400 bg-gray-600 bg-opacity-0 rounded transition-colors hover:text-gray-200 md:hidden hover:bg-opacity-20 focus:bg-opacity-40"
            >
              <IoMdMenu size={28} />
            </button>
          </div>

          <ul ref={menuBarComponentsRef} className="hidden flex-row-reverse gap-4">
            <HeaderItem>
              <DropdownButton
                buttonClassName="p-2 transition-colors hover:bg-pink-800 hover:bg-opacity-20 text-gray-400 hover:text-pink-400 rounded cursor-pointer"
                items={[
                  {
                    name: "Export to .zip",
                    action: async () => await exportCurrentCoverToZip()
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
            <HeaderItem>
              <button
                ref={projectSaveButtonRef}
                className="py-2 px-4 bg-opacity-60 rounded-full"
                onClick={syncDataGlobally}
              >
                <IoMdSave size={28} />
              </button>
            </HeaderItem>
          </ul>
        </header>

        {/** Projects Navigation */}
        <nav ref={projectMenuRef} className="hidden md:block fixed h-full top-20 left-0 md:w-72 w-full bg-gray-700">
          {/** Import / Create */}
          <div className="flex justify-around items-center w-auto h-12 bg-gradient-to-r from-blue-600 to-pink-600">
            <NavbarItem onClick={handleImportCover}>
              Import
            </NavbarItem>
            <NavbarItem onClick={() => setCreateProjectModalVisibility(true)}>
              Create
            </NavbarItem>
          </div>

          {/** Projects List */}
          <div className="overflow-auto fixed bottom-0 top-32 w-full md:w-72">
            {localProjectsMetadata.length > 0
              ? <Fragment>
                {localProjectsMetadata.map(local_project =>
                  <ProjectItem
                    key={local_project.slug}
                    slug={local_project.slug}
                    name={local_project.metadata.name}
                    selected={local_project.slug === project_slug.current}
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
                    onClick={() => setCreateProjectModalVisibility(true)}
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
              element={<ProjectOverview />}
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