import type { ProjectData } from "@/types/Project";
import type { Response } from "@/types/Globals";

import localforage from "localforage";

/** LocalForage store for persistance of projects' data. */
class ProjectsDataLocalStore {
  private store: LocalForage;

  constructor (databaseName: string) {
    this.store = localforage.createInstance({
      storeName: "projects-data",
      name: databaseName
    });
  }

  async get (slug: string): Response<ProjectData> {
    try {
      const data: ProjectData | null = await this.store.getItem(slug);
      if (data) return {
        success: true,
        data
      };

      return {
        success: false,
        message: `Project data of "${slug}" not found.`
      };
    }
    catch (error) {
      return {
        success: false,
        message: "An error occured.",
        debug: { error }
      };
    }
  }

  /** Updates, or creates if not found, a project data in localForage. */
  async update (
    slug: string,
    data: ProjectData
  ): Response<ProjectData> {
    try {
      const stored_data: ProjectData = await this.store.setItem(slug, data);

      return {
        success: true,
        data: stored_data
      };
    }
    catch (error) {
      return {
        success: false,
        message: `Error while updating the data of "${slug}"`,
        debug: { error }
      };
    }
  }

  /** Deletes a project's data in localForage. */
  async delete (slug: string): Response<undefined> {
    try {
      await this.store.removeItem(slug);

      return {
        success: true,
        data: undefined
      };
    }
    catch (error) {
      return {
        success: false,
        message: `Error while deleting the data of "${slug}".`,
        debug: { error }
      };
    }
  }
}

/** => localForage store wrapped with some utility functions. */
export const projectsDataLocal = new ProjectsDataLocalStore("lpadder");
