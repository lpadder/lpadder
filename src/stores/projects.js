class ProjectsStore {
  /** @param {import("localforage")} database */
  constructor (database) {
    /** @type {import("localforage")} */
    this.store = database.createInstance({
      storeName: "projects"
    });
  }

  async getStoredProjects () {
    const projects = [];
    await this.store.iterate((projectData, projectSlug) => {
      projects.push({ slug: projectSlug, data: projectData });
    })
  
    return projects;
  }
}

export default ProjectsStore;