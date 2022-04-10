import type { ProjectStructure } from "@/types/Project";
import create from "zustand";

interface ModalsStore {
  // Modal: "@/components/ImportProjectModal"
  importProjectModal: boolean,
  setImportProjectModal: (value: boolean) => void,
  importProjectModalData: ProjectStructure | null,
  setImportProjectModalData: (data: ProjectStructure | null) => void,

  // Modal: "@/components/CreateProjectModal"
  createProjectModal: boolean,
  setCreateProjectModal: (value: boolean) => void
}

export const useModalsStore = create<ModalsStore>((set) => ({
  importProjectModal: false,
  setImportProjectModal: (value) => set({ importProjectModal: value }),
  importProjectModalData: null,
  setImportProjectModalData: (data) => set({ importProjectModalData: data }),

  createProjectModal: false,
  setCreateProjectModal: (value) => set({ createProjectModal: value })
}));