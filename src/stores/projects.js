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

  async createEmptyProject ({ name, slug, authors = [], launchpadders = [] }) {
    const project = {
      name,
      authors,
      launchpadders
    };

    const alreadyExists = !! await this.store.getItem(slug);
    if (alreadyExists) return [false, "Project already exists."];

    await this.store.setItem(slug, project);
    return [true, slug];
  }
}

export default ProjectsStore;