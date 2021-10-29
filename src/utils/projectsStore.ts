import type { LpadderProject } from "../types/LpadderProject";

import localforage from "localforage";

export default class ProjectsStore {
  public projects: LpadderProject[];
  private store: LocalForage;

  constructor () {
    this.projects = [];
    this.store = localforage.createInstance({
      name: "lpadder"
    });
  }

  public async getProjects(): Promise<LpadderProject[]> {
    const projects = await this.store.getItem("projects") as LpadderProject[];
    if (projects) {
      this.projects = projects;
    }

    return this.projects;
  }

  public async newProject({
    name,
    author
  }: {
    name: string;
    author: string;
  }): Promise<LpadderProject[]> {
    await this.getProjects();
    this.projects.push({
      name,
      author
    });

    return await this.store.setItem("projects", this.projects);
  }
}