import { Component, createEffect } from "solid-js";

import { currentProjectStore, setCurrentProjectStore, resetCurrentProjectStore, setProjectSaved } from "@/stores/current_project";
import { projectsMetadataStore } from "@/stores/projects_metadata";
import { projectsDataLocal } from "@/stores/projects_data";

import { useParams, useNavigate } from "solid-app-router";
import { syncProjectDataGlobally } from "@/utils/projects";
import { log, error, logStart, logEnd } from "@/utils/logger";

import ProjectPreview from "@/components/projects/editor/ProjectPreview";

const ProjectsEditor: Component = () => {
  const navigate = useNavigate();
  const params = useParams();

  /** Short-hand */
  const slug = () => params.slug;

  const platform = navigator.userAgentData?.platform || navigator.platform;
  const saveProjectShortcut = (e: KeyboardEvent) => {
    if (e.key === "s" && (platform.match(/mac/i) ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();

      console.info(`[shortcuts][(ctrl/cmd)+s] trigger save for ${slug()}.`);
      syncProjectDataGlobally();
    }
  };

  createEffect(on(slug, (slug) => {
    (async () => {
      /** Debug. */ console.group(`[EFFECT->${slug}]`);
      logStart("load", `loading ${slug}...`);

      logStart("metadata", `finding "${slug}" from store...`);
      const projectLoadedMetadata = projectsMetadataStore.metadatas.find(project => project.slug === slug);
      logEnd("metadata");

      logStart("data", `getting "${slug}" from localForage...`);
      const projectData = await projectsDataLocal.get(slug);
      logEnd("data");

      if (!projectLoadedMetadata || !projectData.success) {
        error("metadata", `"${slug}" not found. redirecting to '/projects'...`);
        logEnd("load");

        navigate("/projects");
        return;
      }

      log("shortcuts", "configure ctrl/cmd+s.");
      window.addEventListener("keydown", saveProjectShortcut);

      log("stores", "initialize current_project store.");
      setCurrentProjectStore({
        slug,
        data: projectData.data,
        metadata: projectLoadedMetadata.metadata
      }); /** `true` only because we load. */ setProjectSaved(true);

      logEnd("load");
    })();

    onCleanup(() => {
      log("shortcuts", "clean ctrl/cmd+s.");
      window.removeEventListener("keydown", saveProjectShortcut);

      log("stores", "clean current_project store.");
      resetCurrentProjectStore();

      /** Debug. */ console.groupEnd();
    });
  }));

  return (
    <>
      <Title>lpadder - projects: {slug()}</Title>

      <Show when={currentProjectStore.slug !== null && currentProjectStore} fallback={
        <p>Cover {slug()} is currently loading...</p>
      }>
        {project => (
          <>
            <div class="relative w-full -mb-12">
              <ProjectPreview />

            </div>
            <div class="z-5 absolute w-full">

              <div class="flex justify-between px-4">
                <select>
                  <option>add launchpad</option>
                </select>
                <select>
                  <option>add page</option>
                </select>

              </div>

              <p>{project.slug}</p>

            </div>
          </>
        )}
      </Show>
    </>
  );
};

export default ProjectsEditor;
