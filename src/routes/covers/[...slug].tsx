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
  const slug = () => params.slug;

  const platform = navigator.userAgentData?.platform || navigator.platform;
  const saveShortcut = (e: KeyboardEvent) => {
    if (e.key === "s" && (platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      
      console.info(`[CTRL+S] Save for ${slug()}.`);
      syncProjectDataGlobally();
    }
  };

  createEffect(() => {
    (async () => {
      /** CTRL/CMD+S => Save globally the project. */
      console.info(`[covers/${slug()}:mount] configure shortcuts.`);
      window.addEventListener("keydown", saveShortcut);
  
      console.info(`[covers/${slug()}:mount] loading "${slug()}" from metadata and data stores.`);
      const projectLoadedMetadata = projectsMetadataStore.metadatas.find(project => project.slug === slug());
      const projectData = await projectsDataLocal.get(slug());
      
      if (!projectLoadedMetadata || !projectData.success) {
        console.error(`! Cover "${slug()}" not found ! Redirecting to '/covers'.`);
        navigate("/covers");
        return;
      }
    
      setCurrentProjectStore({
        slug: slug(),
        data: projectData.data,
        metadata: projectLoadedMetadata.metadata
      });
  
      console.info(`[covers/${slug()}:mount] successfully loaded "${slug()}" cover.`);    
    })();

    onCleanup(() => {
      console.info(`[covers/${slug()}:cleanup] unconfigure shortcuts.`);
      window.removeEventListener("keydown", saveShortcut);
  
      setCurrentProjectStore({
        data: null,
        metadata: null
      });
    });
  });

  return (
    <div class="p-4">
      <Show when={currentProjectStore.data && currentProjectStore.metadata} fallback={<p>Cover {slug()} is currently loading...</p>}>
        {/* <ProjectPlay />
        <ProjectSampler />
        <ProjectTimeline /> */}
      </Show>
    </div>
  );
};

export default ProjectEditor;