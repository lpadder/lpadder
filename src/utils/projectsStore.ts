import type { StoredProjects, LpadderProject } from "../types/LpadderProjects";

import localforage from "localforage";

const store = localforage.createInstance({
  name: "lpadder",
  storeName: "projects"
});

export async function getProjects (): Promise<StoredProjects> {
  const projects: StoredProjects = {};
  
  await store.iterate((project: LpadderProject, slugName: string) => {
    projects[slugName] = project;
  });

  return projects;
}

export async function getProject (slugName: string): Promise<LpadderProject | undefined> {
  const project = await store.getItem(slugName);
  if (!project) return; 

  return project as LpadderProject;
}

export async function setProject (
  slugName: string,
  project: LpadderProject
) {
  await store.setItem(slugName, project);
}