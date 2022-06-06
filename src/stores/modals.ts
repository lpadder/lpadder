import type { ProjectStructure } from "@/types/Project";
import { createStore } from "solid-js/store";

interface ModalsStore {
  // Modal: "@/components/ImportProjectModal"
  importProjectModal: boolean,
  importProjectModalData: ProjectStructure | null,

  // Modal: "@/components/CreateProjectModal"
  createProjectModal: boolean,
}

export const [modalsStore, setModalsStore] = createStore<ModalsStore>({
  importProjectModal: false,
  importProjectModalData: null,
  createProjectModal: false
});
