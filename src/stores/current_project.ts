import type { ProjectMetadata, ProjectData, } from "@/types/Project";
import create from "zustand";

// Stores
import { storedProjectsData } from "./projects_data";
import { useUnsavedProjectStore } from "./unsaved_project";

interface CurrentProjectStore {
  isGloballySaved: boolean;
  setIsGloballySaved: (value: boolean) => void;

  slug: string | null;
  setSlug: (value: string | null) => void;

  metadata: ProjectMetadata | null;
  setMetadata: (data: ProjectMetadata | null) => void;
  
  data: ProjectData | null;
  setData: (data: ProjectData | null) => void;
}

/**
 * Store used when a project is opened.
 * We use this store to keep track of the current project.
 */
export const useCurrentProjectStore = create<CurrentProjectStore>((set) => ({
  isGloballySaved: true,
  setIsGloballySaved: (value: boolean) => set({ isGloballySaved: value }),
  
  slug: null,
  setSlug: (slug) => set({ slug }),

  metadata: null,
  setMetadata: (metadata) => set({
    metadata,
    isGloballySaved: false
  }),

  data: null,
  setData: (data) => set({
    data,
    isGloballySaved: false
  })
}));

/**
 * Function to sync the current unsaved project to
 * `projects_data` and `currentProjectStore`,
 * for <ProjectPlay /> component.
 */
export const syncDataGlobally = async () => {
  const unsaved_data = useUnsavedProjectStore.getState().data;
  if (!unsaved_data)
    return console.error("syncGlobally: Missing data in 'unsavedProjectStore'.");

  const current_project = useCurrentProjectStore.getState();
  if (!current_project.slug)
    return console.error("syncGlobally: Missing slug in 'currentProjectStore'.");

  // Sync data in localForage.
  await storedProjectsData.updateProjectData(current_project.slug, unsaved_data);

  // Update state of current project, for <ProjectPlay /> reload.
  current_project.setIsGloballySaved(true);
};
