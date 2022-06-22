import { Show, For } from "solid-js";
import type { Component } from "solid-js"; 
import type { ProjectStructure } from "@/types/Project";

import JSZip from "jszip";

import FullLoader from "@/components/FullLoader";

import HeaderItem from "@/components/projects/HeaderItem";
import NavbarItem from "@/components/projects/NavbarItem";
import NavbarHeadItem from "@/components/projects/NavbarHeadItem";

import exportCurrentCoverToZip from "@/utils/exportCurrentCoverToZip";
import checkProjectVersion from "@/utils/checkProjectVersion";
import { syncProjectDataGlobally } from "@/utils/projects";

import DropdownButton from "@/components/DropdownButton";

// import LpadderWrongVersionModal, {
//   LpadderWrongVersionModalData
// } from "@/components/LpadderWrongVersionModal";

import {
  projectsMetadataLocal,
  projectsMetadataStore,
  setProjectsMetadataStore,
} from "@/stores/projects_metadata";

import { currentProjectStore, setCurrentProjectStore } from "@/stores/current_project";

import { setModalsStore } from   "@/stores/modals";

const Projects: Component = () => {
  /**
   * On page load, we take every projects in the localForage
   * and we store them in a global metadata store.
   */
  onMount(async () => {
    if (projectsMetadataStore.loaded) {
      console.info("[@projects/layout:mount] already preloaded every projects' metadata, skipping...");
      return;
    }

    console.info("[@projects/layout:mount] fetching every projects' metadata...");

    const projects_metadatas = await projectsMetadataLocal.getAll();
    setProjectsMetadataStore({ loaded: true, metadatas: projects_metadatas });

    console.info("[@projects/layout:mount] done.");
  });
  
  onCleanup(() => {
    console.info("[@projects/layout:cleanup] clearing stores...");

    setCurrentProjectStore({
      data: null,
      metadata: null
    });

    console.info("[@projects/layout:cleanup] done.");
  });

  const [showMobileHeader, setMobileHeaderVisibility] = createSignal(false);
  
  // const default_lpadderWrongVersionModalData: LpadderWrongVersionModalData = {
  //   requiredVersion: APP_VERSION,
  //   errorMessage: undefined,
  //   lpadderDeployUrl: undefined
  // };

  // const [lpadderWrongVersionModalData, setLpadderWrongVersionModalData] = createSignal<LpadderWrongVersionModalData>(default_lpadderWrongVersionModalData);
  // const [lpadderWrongVersionModalOpen, setLpadderWrongVersionModalOpen] = createSignal(false);

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
          // setLpadderWrongVersionModalData({
          //   requiredVersion: version,
          //   errorMessage: version_data.error_message,
          //   lpadderDeployUrl: version_data.deploy_url
          // });

          // setLpadderWrongVersionModalOpen(true);
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
      <Title>lpadder - covers</Title>
      <Show when={projectsMetadataStore.loaded} fallback={
        <FullLoader message="Preloading the covers..." />
      }>
        {/* <LpadderWrongVersionModal
          open={lpadderWrongVersionModalOpen()}
          closeModal={() => setLpadderWrongVersionModalOpen(false)}

          lpadderDeployUrl={lpadderWrongVersionModalData().lpadderDeployUrl}
          requiredVersion={lpadderWrongVersionModalData().requiredVersion}
          errorMessage={lpadderWrongVersionModalData().errorMessage}
        /> */}

        <div class="h-screen overflow-y-hidden">
          <div class="h-20 flex px-8 bg-gray-900 justify-between items-center">
            {/* Mobile->HeaderTopLeft */}
            <button
              onClick={() => setMobileHeaderVisibility(show => !show)}
              class="md:hidden p-2 text-gray-400 bg-gray-600 bg-opacity-0 rounded transition-colors hover:text-gray-200 hover:bg-opacity-20 focus:bg-opacity-40"
            >
            menu
            </button>

            {/* Desktop->HeaderTopLeft */}
            <p class="hidden md:block font-medium text-lg text-gray-200">
            lpadder.
            </p>

            {/* HeaderTopRight */}
            <Show when={currentProjectStore.slug}>
              <ul class="flex flex-row-reverse gap-4">
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
                    buttonIcon={<button />}
                  />
                </HeaderItem>
                <HeaderItem>
                  <button
                    class="py-2 px-4 bg-opacity-60 rounded-full"
                    onClick={syncProjectDataGlobally}
                  >
                  save
                  </button>
                </HeaderItem>
              </ul>
            </Show>
          </div>

          {/** Projects Navigation */}
          <nav
            class="z-20 md:block fixed h-full top-20 left-0 md:w-72 w-full bg-gray-700"
            classList={{
              "hidden": !showMobileHeader()
            }}
          >
          
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
            <div class="overflow-auto fixed md:bottom-16 bottom-20 top-32 w-full md:w-72">
              <Show when={projectsMetadataStore.metadatas.length > 0} fallback={
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
              
                <For each={projectsMetadataStore.metadatas}>
                  {local_project => (
                    <NavbarItem
                      slug={local_project.slug}
                      name={local_project.metadata.name}
                    />
                  )}
                </For>
              </Show>
            </div>

            <Link
              href="/"
              class="fixed bottom-0 md:h-16 h-20 w-full md:w-72 bg-gray-500 hover:bg-pink-500 flex justify-center items-center font-medium text-lg transition-colors shadow-lg"
            >
            EXIT
            </Link>
          </nav>

          <div class="fixed bottom-0 top-20 left-0 md:left-72 right-0 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </Show>
    </>
  );
};

export default Projects;