import type {
  ProjectStoredStructure,
  ProjectStructure
} from "../types/Project";

type CreateEmptyProjectProps = {
  name: string;
  slug: string;
  authors?: string[];
  launchpadders?: string[];
};

import localforage from "localforage";

class ProjectsStore {
  private store: LocalForage;

  constructor (databaseName: string) {
    this.store = localforage.createInstance({
      storeName: "projects",
      name: databaseName
    });
  }

  /**
   * Get every project from the
   * local database in an array.
   */
  public async getStoredProjects () {
    const projects: ProjectStoredStructure[] = [];

    // Iterate every key/value from the database.
    await this.store.iterate((projectData: ProjectStructure, projectSlug) => {
      projects.push({
        slug: projectSlug,
        data: projectData
      });
    });
  
    return projects;
  }

  async getProjectFromSlug (slug: string): Promise<[boolean, ProjectStructure | string]> {
    try {
      const project: ProjectStructure | null = await this.store.getItem(slug);
      if (project) {
        return [true, project];
      }

      return [false, "Project not found."];
    }
    catch (e) {
      /** Debug */ console.error("[stores->projects->getProjectFromSlug]", e);
      return [false, e as string];
    }
  }

  /**
   * Update or create an entry in the local database.
   * 'slug' is the key and 'data' the value.
   * 
   * On success, returns true, slug and saved data.
   * On error, returns false and error message.
   */
  async updateProject (
    slug: string,
    data: ProjectStructure
  ): Promise<[boolean, string, (ProjectStructure | null)]> {
    try {
      const savedData: ProjectStructure = await this.store.setItem(slug, data);
      return [true, slug, savedData];
    }
    catch (e) {
      /** Debug */ console.error("[stores->projects->updateProject]", e);
      return [false, e as string, null];
    }
  }

  async deleteProject (slug: string) {
    try {
      await this.store.removeItem(slug);
      return true;
    }
    catch (e) {
      /** Debug */ console.error("[stores->projects->deleteProject]", e);
      return false;
    }
  }

  async createEmptyProject ({
    name,
    slug,
    authors = [],
    launchpadders = []
  }: CreateEmptyProjectProps): Promise<[
    boolean, string, (ProjectStructure | null)
  ]> {
    if (!name || !slug) return [false, "Project name and slug are required.", null];

    // Defining an empty project.
    const project: ProjectStructure = {
      // Version of lpadder is defined globally, see `global.d.ts`.
      version: APP_VERSION,

      name,
      authors,
      launchpadders,
      launchpads: [],
      assets: []
    };

    // Check if the slug already exists.
    const [alreadyExists] = await this.getProjectFromSlug(slug);
    if (alreadyExists) return [false, "Project already exists.", null];

    // Store the new project.
    const [status] = await this.updateProject(slug, project);
    return [status, slug, project];
  }
}

export default ProjectsStore;
