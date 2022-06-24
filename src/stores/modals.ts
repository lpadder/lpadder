import type { ProjectStructure } from "@/types/Project";
import { createStore } from "solid-js/store";

interface ModalsStore {
  // Modal: "@/components/ImportProjectModal"
  importProjectModal: boolean;
  importProjectModalData: ProjectStructure | null;

  // Modal: "@/components/CreateProjectModal"
  createProjectModal: boolean;

  // Modal: "@/components/LpadderWrongVersionModal"
  lpadderWrongVersionModal: boolean;
  lpadderWrongVersionModalData: {
    required_version: string;
    success: boolean;
    data: string;
  } | null;
}

/** This store contains the data for almost every modals of lpadder. */
export const [modalsStore, setModalsStore] = createStore<ModalsStore>({
  importProjectModal: false,
  importProjectModalData: null,

  createProjectModal: false,

  lpadderWrongVersionModal: false,
  lpadderWrongVersionModalData: null
});
