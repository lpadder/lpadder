/**
 * Content of a cover that is stored in
 * a cover.json file or in localForage.
 */
export interface ProjectStructure {
  name: string;
  authors: string[];
  launchpadders: string[];
}

/**
 * Same as ProjectStructure but with slug
 * that is used in getStoredProject
 */
export interface ProjectStoredStructure {
  slug: string;
  data: ProjectStructure;
}