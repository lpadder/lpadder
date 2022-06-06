import { Component, createEffect, createSignal, ParentComponent } from "solid-js"; 
import type { ProjectStructure } from "@/types/Project";

import { Show, For, onMount, onCleanup } from "solid-js";

import { Link, Outlet, useParams } from "solid-app-router";
import JSZip from "jszip";

import HeaderItem from "@/components/projects/HeaderItem";
import NavbarItem from "@/components/projects/NavbarItem";
import NavbarHeadItem from "@/components/projects/NavbarHeadItem";

import exportCurrentCoverToZip from "@/utils/exportCurrentCoverToZip";
import checkProjectVersion from "@/utils/checkProjectVersion";

// Components in the layout.
// import ProjectOverview from "@/pages/projects/slug/index";

import LpadderWrongVersionModal, {
  LpadderWrongVersionModalData
} from "@/components/LpadderWrongVersionModal";

import DropdownButton from "@/components/DropdownButton";

import {
  projectsMetadataLocal,
  projectsMetadataStore,
  setProjectsMetadataStore,
} from "@/stores/projects_metadata";

import { currentProjectStore, setCurrentProjectStore } from "@/stores/current_project";

import { setModalsStore } from "@/stores/modals";

import { syncProjectDataGlobally } from "@/utils/projects";

// Icons
import { HiOutlineShare, HiOutlineDotsVertical } from "solid-icons/hi";
import { IoMenu, IoSave, IoHome } from "solid-icons/io";

const Projects: Component = () => {
  const params = useParams();

  /**
   * On page load, we take every cover in the localForage
   * and we store it in a global state that'll be shared
   * with children components.
   * 
   * We also check if a project slug was specified.
   */
  onMount(async () => {
    console.group("[projects/Layout] onMount");
    console.info("⌛ Fetching every stored projects' metadatas...");

    const projects_metadatas = await projectsMetadataLocal.getAll();
    setProjectsMetadataStore(projects_metadatas);

    /** Debug. */ console.info(
      "✔️ Stored every projects' metadatas in local store: 'projectsMetadataStore' !"
    );

    /**
     * Initial slug defined in the URL.
     * An initial slug is when you go directly to `/projects/my_slug`
     * and press enter in your browser address bar.
     * 
     * When an initial slug is set in the URL params,
     * we need to load the project, if exists, linked to it.
     */
    const initialUrlSlug = params.slug;

    // Check if the project's slug exists.
    const initialUrlProject = projects_metadatas.find(
      project => project.slug === initialUrlSlug
    );

    // If the project is found from slug.
    if (initialUrlProject) {
      console.info("→ Found matching project from slug in URL: ", initialUrlSlug);
      console.groupEnd();

      // Save slug in current project store.
      setCurrentProjectStore({ slug: initialUrlSlug });
    }
    else console.groupEnd();
  });
  
  onCleanup(() => {
    console.info("[projects/onCleanup] ⌛ Clearing current project store...");
    
    setCurrentProjectStore({
      data: null,
      metadata: null,
      slug: null
    });
  });

  /** CTRL/CMD+S => Save globally the project. */
  createEffect(() => {
    console.info("[projects/effect] ⌛ Configure shortcuts.");

    const platform = navigator.userAgentData?.platform || navigator.platform;
    const saveShortcut = (e: KeyboardEvent) => {
      if (e.key === "s" && (platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();

        if (!currentProjectStore.slug) return;

        console.info(`[CTRL+S] Save for ${currentProjectStore.slug}.`);
        syncProjectDataGlobally();
      }
    };

    onCleanup(() => {
      console.info("[projects/effect:onCleanup] ⌛ Unconfigure shortcuts.");
      window.removeEventListener("keydown", saveShortcut);
    });
  });

  const [showMobileHeader, setMobileHeaderVisibility] = createSignal(false);
  
  const default_lpadderWrongVersionModalData: LpadderWrongVersionModalData = {
    requiredVersion: APP_VERSION,
    errorMessage: undefined,
    lpadderDeployUrl: undefined
  };

  const [lpadderWrongVersionModalData, setLpadderWrongVersionModalData] = createSignal<LpadderWrongVersionModalData>(default_lpadderWrongVersionModalData);
  const [lpadderWrongVersionModalOpen, setLpadderWrongVersionModalOpen] = createSignal(false);

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

        setModalsStore({
          importProjectModal: true,
          importProjectModalData: parsedCoverData
        });
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


  return (
    <>
      <LpadderWrongVersionModal
        open={lpadderWrongVersionModalOpen()}
        closeModal={() => setLpadderWrongVersionModalOpen(false)}

        lpadderDeployUrl={lpadderWrongVersionModalData().lpadderDeployUrl}
        requiredVersion={lpadderWrongVersionModalData().requiredVersion}
        errorMessage={lpadderWrongVersionModalData().errorMessage}
      />

      <div
        class="h-screen overflow-y-hidden"
        onContextMenu={(e) => /** Prevent context menu. */ e.preventDefault()}
      >
        <div class="h-20 flex px-8 bg-gray-900 justify-between items-center">
          <button
            onClick={() => setMobileHeaderVisibility(show => !show)}
            class="md:hidden p-2 text-gray-400 bg-gray-600 bg-opacity-0 rounded transition-colors hover:text-gray-200 hover:bg-opacity-20 focus:bg-opacity-40"
          >
            <IoMenu size={28} />
          </button>
            
          <Link
            class="flex md:flex flex-row justify-center gap-2 items-center p-2 text-gray-400 bg-opacity-20 rounded transition-colors hover:text-gray-200 hover:bg-opacity-60"
            href="/"
          >
            <IoHome size={28} /> Home
          </Link>

          <ul class="hidden flex-row-reverse gap-4">
            <HeaderItem>
              <DropdownButton
                items={[
                  {
                    name: "Export to .zip",
                    action: async () => await exportCurrentCoverToZip()
                  },
                  { isSeparator: true },
                  {
                    name: "Collaborate online",
                    action: () => console.info("Collaborate")
                  },
                ]}

                buttonClassName="p-2 transition-colors hover:bg-pink-800 hover:bg-opacity-20 text-gray-400 hover:text-pink-400 rounded cursor-pointer"
                buttonIcon={<HiOutlineShare size={28} />}
              />
            </HeaderItem>
            <HeaderItem>
              <button
                class="py-2 px-4 bg-opacity-60 rounded-full"
                onClick={syncProjectDataGlobally}
              >
                <IoSave size={28} />
              </button>
            </HeaderItem>
          </ul>
        </div>

        {/** Projects Navigation */}
        <nav class="z-20 hidden md:block fixed h-full top-0 md:top-20 left-0 md:w-72 w-full bg-gray-700">
          {/* <HeaderNavigation */}
          {/* // class="md:hidden"
            // showHomeButtonOnMobile={true} */}
          {/* /> */}
          
          {/** Import / Create */}
          <div class="flex justify-around items-center w-auto h-12 bg-gradient-to-r from-blue-600 to-pink-600">
            <NavbarHeadItem onClick={handleImportCover}>
              Import
            </NavbarHeadItem>
            <NavbarHeadItem onClick={() => setModalsStore({ createProjectModal: true })}>
              Create
            </NavbarHeadItem>
          </div>

          {/** Projects List */}
          <div class="overflow-auto fixed bottom-0 top-32 w-full md:w-72">
            <Show when={projectsMetadataStore.length > 0} fallback={
              <div class="flex flex-col gap-8 justify-center items-center px-4 h-full">
                <p class="text-lg font-medium">
                    Nothing to play here...
                </p>
                <div class="flex flex-col gap-4 justify-center items-center">
                  <button
                    class="px-4 py-2 font-medium bg-pink-600 bg-opacity-20 rounded border-2 border-pink-600"
                    onClick={() => setModalsStore({ createProjectModal: true })}
                  >
                      Create a new cover !
                  </button>
                  <span>OR</span>
                  <button
                    class="px-4 py-2 font-medium bg-blue-600 bg-opacity-20 rounded border-2 border-blue-600"
                    onClick={handleImportCover}
                  >
                      Import a lpadder cover
                  </button>
                </div>
              </div>
            }>
              
              <For each={projectsMetadataStore}>
                {local_project => (
                  <NavbarItem
                    slug={local_project.slug}
                    name={local_project.metadata.name}
                    selected={local_project.slug === currentProjectStore.slug}
                  />
                )}
              </For>
            </Show>
          </div>
        </nav>

        <div class="fixed bottom-0 top-20 left-0 md:left-72 right-0 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Projects;