/**
 * Projects that are stored in localForage.
 */
export type StoredProjects = {
  [slugName: string]: LpadderProject;
};

/**
 * Actual project's datas.
 */
export type LpadderProject = {
  name: string;
  author: string;
}
