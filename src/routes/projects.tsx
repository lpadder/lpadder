import type { FlowComponent } from "solid-js";

import LpadderLogo from "@/assets/icon.png";

// Components
import FullLoader from "@/components/FullLoader";
import DropdownButton from "@/components/DropdownButton";

// Components for /projects
import HeaderItem from "@/components/projects/HeaderItem";
import NavbarItem from "@/components/projects/NavbarItem";
import NavbarHeadItem from "@/components/projects/NavbarHeadItem";

// Utilities
import { syncProjectDataGlobally, createImportProject } from "@/utils/projects";
import exportCurrentCoverToZip from "@/utils/exportCurrentCoverToZip";
import { correctCanvasMove, setPreviewCanvasFullscreen } from "@/components/projects/editor/ProjectPreview";
import { log, logStart, logEnd } from "@/utils/logger";

// Stores
import { currentProjectStore, projectSaved, setCurrentProjectStore } from "@/stores/current_project";
import { setModalsStore } from   "@/stores/modals";
import {
  projectsMetadataLocal,
  projectsMetadataStore,
  setProjectsMetadataStore
} from "@/stores/projects_metadata";
import ImportProjectModal from "@/components/modals/ImportProjectModal";
import CreateProjectModal from "@/components/modals/CreateProjectModal";

const ProjectsLayout: FlowComponent = (props) => {
  /** We group the mount and cleanup for debugging purposes. */
  onMount(() => console.group("[PROJECTS->MOUNT]"));
  onCleanup(() => console.groupEnd());

  onMount(async () => {
    if (projectsMetadataStore.loaded) {
      log("metadatas", "already preloaded, skipping.");
      return;
    }

    logStart("metadatas", "fetching every projects' metadata...");
    const projects_metadatas = await projectsMetadataLocal.getAll();
    logEnd("metadatas");

    setProjectsMetadataStore({ loaded: true, metadatas: projects_metadatas });
  });

  const [showMobileHeader, setMobileHeaderVisibility] = createSignal(false);

  return (
    <>
      <Title>lpadder - projects</Title>

      <ImportProjectModal />
      <CreateProjectModal />

      <Show when={projectsMetadataStore.loaded} fallback={
        <FullLoader message="Preloading the projects' metadata..." />
      }>
        <div class="h-screen overflow-y-hidden">
          <div class="h-20 flex px-8 bg-slate-900 justify-between items-center">
            {/* Mobile->HeaderTopLeft */}
            <button
              onClick={() => setMobileHeaderVisibility((show) => !show)}
              class="flex text-2xl md:hidden p-2 text-slate-400 bg-slate-600 bg-opacity-0 rounded transition-colors hover:text-slate-200 hover:bg-opacity-20 focus:bg-opacity-40"
            >
              <Show when={showMobileHeader()} fallback={<IconMdiMenu />}>
                <IconMdiClose />
              </Show>
            </button>

            {/* Desktop->HeaderTopLeft */}
            <div class="hidden md:(flex items-center gap-4)">
              <img class="w-10 h-10" src={LpadderLogo} alt="lpadder's logo" />
              <span class="font-medium text-xl text-slate-300">lpadder.</span>
            </div>

            {/* HeaderTopRight */}
            <Show when={currentProjectStore.slug && !showMobileHeader()}>
              <ul class="flex flex-row-reverse gap-4">
                <HeaderItem>
                  <DropdownButton
                    items={[
                      [
                        {
                          name: "Fullscreen",
                          action: () => setPreviewCanvasFullscreen(true)
                        },
                        {
                          name: "Center preview canvas",
                          action: () => {
                            setCurrentProjectStore("metadata", "defaultCanvasViewPosition", {
                              x: 0, y: 0
                            });
                            correctCanvasMove();
                          }
                        }
                      ],
                      [
                        {
                          name: "Export to .zip",
                          action: exportCurrentCoverToZip
                        },
                        {
                          name: "Collaborate online",
                          action: () => console.info("Collaborate")
                        }
                      ]
                    ]}

                    buttonClassName="p-2 text-xl transition-colors hover:bg-fuchsia-800 hover:bg-opacity-20 text-slate-400 hover:text-fuchsia-400 rounded cursor-pointer"
                    buttonIcon={<IconMdiDotsVertical />}
                  />
                </HeaderItem>

                <HeaderItem>
                  <Show when={projectSaved() === false}>
                    <button
                      class="flex text-xl py-2 px-4 bg-opacity-60 rounded-full"
                      onClick={syncProjectDataGlobally}
                    >
                      <IconMdiContentSave />
                    </button>
                  </Show>
                </HeaderItem>
              </ul>
            </Show>
          </div>

          {/** Projects navigation */}
          <nav class="z-5 md:z-0 md:block fixed h-full top-20 left-0 md:w-72 w-full bg-slate-700"
            classList={{
              "hidden": !showMobileHeader()
            }}
          >

            {/** Import / Create */}
            <div class="flex justify-around items-center w-auto h-12 bg-gradient-to-r from-sky-600 to-fuchsia-600">
              <NavbarHeadItem onClick={createImportProject}>
                Import
              </NavbarHeadItem>
              <NavbarHeadItem onClick={() => setModalsStore({ createProjectModal: true })}>
                Create
              </NavbarHeadItem>
            </div>

            {/** Projects list */}
            <div class="overflow-auto fixed md:bottom-16 bottom-20 top-32 w-full md:w-72">
              <Show when={projectsMetadataStore.metadatas.length > 0} fallback={
                <div class="flex flex-col gap-8 justify-center items-center px-4 h-full">
                  <p class="text-lg font-medium">
                    Nothing to play here...
                  </p>
                  <div class="flex flex-col gap-4 justify-center items-center">
                    <button
                      class="px-4 py-2 font-medium bg-fuchsia-600 bg-opacity-20 rounded border-2 border-fuchsia-600"
                      onClick={() => setModalsStore({ createProjectModal: true })}
                    >
                      Create a new project !
                    </button>
                    <span>OR</span>
                    <button
                      class="px-4 py-2 font-medium bg-sky-600 bg-opacity-20 rounded border-2 border-sky-600"
                      onClick={createImportProject}
                    >
                      Import a lpadder project
                    </button>
                  </div>
                </div>
              }>
                <For each={projectsMetadataStore.metadatas}>
                  {(local_project) => (
                    <NavbarItem
                      slug={local_project.slug}
                      name={local_project.metadata.name}
                    />
                  )}
                </For>
              </Show>
            </div>

            <A
              href="/"
              class="fixed bottom-0 md:h-16 h-20 w-full md:w-72 bg-slate-500 hover:bg-fuchsia-500 focus:bg-sky-500 flex justify-center items-center font-medium text-lg transition-colors shadow-lg"
            >
              EXIT
            </A>
          </nav>

          {/** Project editor */}
          <div class="fixed bottom-0 top-20 left-0 md:left-72 right-0 overflow-y-auto">
            {props.children}
          </div>
        </div>
      </Show>
    </>
  );
};

export default ProjectsLayout;
