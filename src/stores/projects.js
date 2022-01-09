import localforage from "localforage";

class ProjectsStore {
  /** @param {string} databaseName */
  constructor (databaseName) {
    this.store = localforage.createInstance({
      storeName: "projects",
      name: databaseName
    });
  }

  async getStoredProjects () {
    const projects = [];
    await this.store.iterate((projectData, projectSlug) => {
      projects.push({ slug: projectSlug, data: projectData });
    })
  
    return projects;
  }

  async getProjectFromSlug (slug) {
    const project = await this.store.getItem(slug);
    return project;
  }

  /**
   * @param {string} slug
   * @param {object} project
   * @returns {Promise<[boolean, string, object | undefined]>}
   */
  async updateProject (slug, data) {
    try {
      const savedData = await this.store.setItem(slug, data);
      return [true, slug, savedData];
    }
    catch (e) {
      return [false, e];
    }
  }

  async deleteProject (slug) {
    return await this.store.removeItem(slug);
  }

  async createEmptyProject ({ name, slug, authors = [], launchpadders = [] }) {
    if (!name || !slug) return [false, "Project name and slug are required."];

    // Define a new empty project.
    const project = {
      name,
      authors,
      launchpadders
    };

    // Check if the slug already exists.
    const alreadyExists = !! await this.getProjectFromSlug(slug);
    if (alreadyExists) return [false, "Project already exists."];

    // Store the new project.
    const status = await this.updateProject(slug, project);
    return status;
  }
}

export default ProjectsStore;