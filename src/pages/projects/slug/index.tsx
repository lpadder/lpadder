import { useEffect } from "react";
import logger from "@/utils/logger";

import {
  useParams,
  useNavigate
} from "react-router-dom";

// Stores.
import { useCurrentProjectStore } from "@/stores/current_project";
import { useLocalProjectsStore } from "@/stores/projects_metadata";
import { useUnsavedProjectStore } from "@/stores/unsaved_project";
import { storedProjectsData } from "@/stores/projects_data";
import shallow from "zustand/shallow";

// Components.
import ProjectPlay from "@/components/ProjectPlay";
import ProjectEditor from "@/components/ProjectEditor";

export default function ProjectOverview () {
  const navigate = useNavigate();
  const params = useParams();

  const log = logger("/:slug");
  /** Debug. */ log.render();
  
  const project = useCurrentProjectStore(state => ({
    metadata: state.metadata,
    setData: state.setData,
    setMetadata: state.setMetadata,
    setIsGloballySaved: state.setIsGloballySaved
  }), shallow);
  
  // Update project to use when slug change.
  const projectSlug = params.slug;
  useEffect(() => {
    (async () => {
      const localProjectsMetadata = useLocalProjectsStore.getState().localProjectsMetadata;
      if (!projectSlug || !localProjectsMetadata) return;

      log.effectGroup("Load.");
      console.info("⌛ Loading", projectSlug, "project metadata and data from stores.");

      const projectLoadedMetadata = localProjectsMetadata.find(local_project => local_project.slug === projectSlug);
      const projectData = await storedProjectsData.getProjectDataFromSlug(projectSlug);
    
      if (!projectLoadedMetadata || !projectData.success) {
        console.error(`! Project "${projectSlug}" not found ! Redirecting to "/projects".`);
        console.groupEnd();
      
        navigate("/projects");
        return;
      }

      // Sync with local stores.
      project.setData(projectData.data);
      useUnsavedProjectStore.getState().setData(projectData.data);
      project.setMetadata(projectLoadedMetadata.metadata);
      
      // On the first load, the project is already saved
      // but when calling `setMetadata` and `setData`, it will
      // automatically set `isGloballySaved` to false.
      project.setIsGloballySaved(true);
      
      console.info("✔️ Finished load of", projectSlug, "project.");
      console.groupEnd();
    })();
  }, [projectSlug]);

  // Show a loader while loading data and metadata.
  if (!project.metadata)
    return <p>Loading...</p>;

  return (
    <div className="p-4">
      <ProjectPlay />
      <ProjectEditor />
    </div>
  );
}
