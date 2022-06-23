import { Component, createEffect } from "solid-js";

import { Show, onCleanup } from "solid-js";
import { useParams, useNavigate } from "solid-app-router";

// Stores.
import { currentProjectStore, setCurrentProjectStore } from "@/stores/current_cover";
import { projectsMetadataStore } from "@/stores/projects_metadata";
import { projectsDataLocal } from "@/stores/projects_data";

import { syncProjectDataGlobally } from "@/utils/covers";

// Components.
// import ProjectPlay from "@/components/ProjectPlay";
// import ProjectEditor from "@/components/ProjectEditor";
// import ProjectSampler from "@/components/ProjectSampler";

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

  createEffect(() => {
    (async () => {
      /** Debug. */ console.group(`[EFFECT->${slug()}]`);
  
      console.info(`[metadata] find "${slug()}" from store.`);
      const projectLoadedMetadata = projectsMetadataStore.metadatas.find(project => project.slug === slug());
      
      console.info(`[data] get "${slug()}" from localForage.`);
      const projectData = await projectsDataLocal.get(slug());
      
      if (!projectLoadedMetadata || !projectData.success) {
        console.error(`[ERROR] "${slug()}" not found ! Redirecting to '/projects'.`);
        navigate("/projects");
        return;
      }

      /** CTRL/CMD+S => Save globally the project. */
      console.info("[shortcuts] configure.");
      window.addEventListener("keydown", saveProjectShortcut);
    
      console.info("[stores] load.");
      setCurrentProjectStore({
        slug: slug(),
        data: projectData.data,
        metadata: projectLoadedMetadata.metadata
      });
  
      console.info("[stores] done.");    
    })();

    onCleanup(() => {
      console.info("[shortcuts] unconfigure.");
      window.removeEventListener("keydown", saveProjectShortcut);
      
      console.info("[stores] clean.");
      setCurrentProjectStore({
        slug: null,
        data: null,
        metadata: null,
      });

      /** Debug. */ console.groupEnd();
    });
  });

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