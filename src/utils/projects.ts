import type { ProjectData, ProjectMetadata } from "@/types/Project";
import type { Response } from "@/types/Globals";

import { currentProjectStore } from "@/stores/current_project";
import { projectsDataLocal } from "@/stores/projects_data";
import {
  projectsMetadataLocal,
  setProjectsMetadataStore
} from "@/stores/projects_metadata";

import { produce } from "solid-js/store";

/** Saves the current project to localForage. */
export const syncProjectDataGlobally = async () => {

  /** Current data in current project store. */
  const current_project = currentProjectStore;
  if (!current_project.slug || !current_project.data) {
    console.error("[syncProjectDataGlobally] Missing 'current_project' data and slug.");
    return false;
  }

  /** Saved data into localForage. */
  const response = await projectsDataLocal.update(current_project.slug, current_project.data);

  if (!response.success) {
    console.error("[syncProjectDataGlobally] An error was thrown while saving to localForage.", response.debug);
    return false;
  }

  return true;
};

/** Takes a `slug` parameter and creates a new project with that slug. */
export const createNewProject = async (
  slug: string,
  name = "Untitled",
  options?: { data: ProjectData, metadata: ProjectMetadata }
): Promise<Response<undefined>> => {
  if (!slug) return {
    success: false,
    message: "Slug is required."
  };

  // Check if the project's slug already exists.
  const { success: alreadyExists } = await projectsMetadataLocal.get(slug);
  if (alreadyExists) return {
    success: false,
    message: "A project with this slug already exists."
  };

  const data: ProjectData = options?.data || {
    launchpads: [],
    files: {},
    
    /** 120 is the default BPM. */
    global_bpm: 120
  };
  
  const metadata: ProjectMetadata = options?.metadata || {
    name,
    authors: [],
    launchpadders: [],

    // Version of lpadder is defined globally, see `@/global.d.ts`.
    version: import.meta.env.DEV ? "next" : APP_VERSION,
  };

  // Update the data localForage.    
  const data_response = await projectsDataLocal.update(slug, data);
  if (!data_response.success) return data_response;
  
  // Update the metadata localForage.    
  const metadata_response = await projectsMetadataLocal.update(slug, metadata);
  if (!metadata_response.success) return metadata_response;
  
  // Update the metadata store.    
  setProjectsMetadataStore(
    produce((store => {
      store.metadatas.push({ slug, metadata });
    }))
  );

  return {
    success: true,
    data: undefined
  };
};
/** Takes a `slug` parameter and deletes the corresponding project. */
export const deleteProject = async (slug: string): Promise<Response<undefined>> => {
  if (!slug) return {
    success: false,
    message: "Slug is required."
  };

  // Update the data localForage.    
  const data_response = await projectsDataLocal.delete(slug);
  if (!data_response.success) return data_response;
  
  // Update the metadata localForage.    
  const metadata_response = await projectsMetadataLocal.delete(slug);
  if (!metadata_response.success) return metadata_response;
  
  // Update the metadata store.    
  setProjectsMetadataStore(
    produce((store => {
      const index = store.metadatas.findIndex(metadata => metadata.slug === slug);
      if (index !== -1) store.metadatas.splice(index, 1);
    }))
  );

  return {
    success: true,
    data: undefined
  };
};