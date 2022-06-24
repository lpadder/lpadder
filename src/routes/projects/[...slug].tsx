import { Component, createEffect } from "solid-js";

import { Show, onCleanup } from "solid-js";
import { useParams, useNavigate } from "solid-app-router";

// Stores.
import { currentProjectStore, setCurrentProjectStore } from "@/stores/current_cover";
import { projectsMetadataStore } from "@/stores/projects_metadata";
import { projectsDataLocal } from "@/stores/projects_data";

import { syncProjectDataGlobally } from "@/utils/projects";

// Components.
// Import ProjectPlay from "@/components/ProjectPlay";
// Import ProjectEditor from "@/components/ProjectEditor";
// Import ProjectSampler from "@/components/ProjectSampler";

const ProjectEditor: Component = () => {
  const navigate = useNavigate();
  const params = useParams();

  /** Short-hand */
  const slug = () => params.slug;

  const platform = navigator.userAgentData?.platform || navigator.platform;
  const saveProjectShortcut = (e: KeyboardEvent) => {
    if (e.key === "s" && (platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();

      console.info(`[shortcuts][(ctrl/cmd)+s] trigger save for ${slug()}.`);
      syncProjectDataGlobally();
    }
  };

  createEffect(on(slug, (slug) => {
    (async () => {
      /** Debug. */ console.group(`[EFFECT->${slug}]`);
      console.time("load");

      console.info(`[metadata] finding "${slug}" from store...`);
      console.time("metadata");
      const projectLoadedMetadata = projectsMetadataStore.metadatas.find(project => project.slug === slug);
      console.timeLog("metadata");

      console.info(`[data] getting "${slug}" from localForage...`);
      console.time("data");
      const projectData = await projectsDataLocal.get(slug);
      console.timeLog("data");

      if (!projectLoadedMetadata || !projectData.success) {
        console.error(`[ERROR] "${slug}" not found ! Redirecting to '/projects'.`);
        console.timeEnd("load");

        navigate("/projects");
        return;
      }

      /** CTRL/CMD+S => Save globally the project. */
      console.info("[shortcuts] configure ctrl/cmd+s.");
      window.addEventListener("keydown", saveProjectShortcut);

      console.info("[stores] initialize current project store.");
      setCurrentProjectStore({
        slug,
        data: projectData.data,
        metadata: projectLoadedMetadata.metadata
      });

      console.timeEnd("load");
    })();

    onCleanup(() => {
      console.info("[shortcuts] unconfigure.");
      window.removeEventListener("keydown", saveProjectShortcut);

      console.info("[stores] clean.");
      setCurrentProjectStore({
        slug: null,
        data: null,
        metadata: null
      });

      /** Debug. */ console.groupEnd();
    });
  }));

  return (
    <>
      <Title>lpadder - projects: {slug()}</Title>

      <div class="p-4">
        <Show when={currentProjectStore.data && currentProjectStore.metadata} fallback={<p>Cover {slug()} is currently loading...</p>}>
          {/* <ProjectPlay />
          <ProjectSampler />
          <ProjectTimeline /> */}
        </Show>
      </div>
    </>
  );
};

export default ProjectEditor;
