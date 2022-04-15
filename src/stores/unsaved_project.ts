import type { ProjectData } from "@/types/Project";
import create from "zustand";

import { useCurrentProjectStore } from "./current_project";

interface UnsavedProjectStore {
  data: ProjectData | null;
  setData: (data: ProjectData | null) => void;
}

/**
 * This store is used to keep track of modifications
 * to the current project in <ProjectEditor /> component.
 */
export const useUnsavedProjectStore = create<UnsavedProjectStore>((set) => ({
  data: null,
  setData: (data) => {
    // When data is modified, we set the project as not globally saved.
    if (useCurrentProjectStore.getState().isGloballySaved !== false)
      useCurrentProjectStore.getState().setIsGloballySaved(false);
      
    set({ data });
  }
}));