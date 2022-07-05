import type { ProjectMetadata, ProjectData } from "@/types/Project";
import { createStore, SetStoreFunction, StoreSetter } from "solid-js/store";

/** Know if the current project is saved or not. */
export const [projectSaved, setProjectSaved] = createSignal<boolean | null>(null);

type CurrentProjectStore = {
  slug: null;
  metadata: null;
  data: null;
} | {
  slug: string;
  metadata: ProjectMetadata;
  data: ProjectData;
}

/**
 * Store used when a project is opened.
 * We use this store to keep track of the current project.
 */
export const [currentProjectStore, setCurrentProjectStoreRaw] = createStore<CurrentProjectStore>({
  slug: null,
  metadata: null,
  data: null
});

/**
 * Wrapper for the setter of the `current_project` store
 * so we can automatically pass the `projectSaved` signal to false on updates.
 */
export const setCurrentProjectStore: SetStoreFunction<CurrentProjectStore> = (...setters: StoreSetter<CurrentProjectStore, []>[]): ReturnType<typeof setCurrentProjectStoreRaw> => {
  setProjectSaved(false);

  const args = setters as Parameters<typeof setCurrentProjectStoreRaw>;
  return setCurrentProjectStoreRaw(...args);
};

export const resetCurrentProjectStore = () => {
  setCurrentProjectStoreRaw({
    slug: null,
    metadata: null,
    data: null
  });

  setProjectSaved(null);
};
