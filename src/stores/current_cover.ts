import type { ProjectMetadata, ProjectData } from "@/types/Project";
import { createStore } from "solid-js/store";

interface CurrentProjectStore {
  slug: string | null;
  saved: boolean | null;

  metadata: ProjectMetadata | null;
  data: ProjectData | null;
}

/**
 * Store used when a project is opened.
 * We use this store to keep track of the current project.
 */
export const [currentProjectStore, setCurrentProjectStore] = createStore<CurrentProjectStore>({
  slug: null,
  saved: null,

  metadata: null,
  data: null
});
