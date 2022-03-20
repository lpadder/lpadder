export type ProjectStructureLaunchpadPageSample = {
  padId: string;
}

export type ProjectStructureLaunchpadPage = {
  name: string;
  samples: ProjectStructureLaunchpadPageSample[];
}

export type ProjectStructureAssets = {
  fileName: string;
  /**
   * Uint8Array only when the data is stored.
   * string is for path in the current "lpadder zip" file.
   */
  data: Uint8Array | string;

  /** Used as a filter for assets. */
  type: "audio";
}

/**
 * Content of a cover that is stored in
 * a cover.json file or in localForage.
 */
export interface ProjectStructure {
  name: string;
  authors: string[];
  launchpadders: string[];
  launchpads: ProjectStructureLaunchpadPage[][];
  assets: ProjectStructureAssets[];
}

/**
 * Same as ProjectStructure but with slug
 * that is used in getStoredProject
 */
export interface ProjectStoredStructure {
  slug: string;
  data: ProjectStructure;
}
