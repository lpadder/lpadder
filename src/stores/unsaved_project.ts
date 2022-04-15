import type { ProjectData } from "@/types/Project";
import create from "zustand";

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
  setData: (data) => set({ data })
}));