import type { ProjectData } from "@/types/Project";

import localforage from "localforage";

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface FailResponse {
  success: false;
  message: string;
  debug?: unknown;
}

type Response<T> = Promise<SuccessResponse<T> | FailResponse>;

/** localForage store for persistance of projects. */
class StoredProjectsDataStore {
  private store: LocalForage;

  constructor (databaseName: string) {
    this.store = localforage.createInstance({
      storeName: "projects-data",
      name: databaseName
    });
  }

  async getProjectDataFromSlug (projectSlug: string): Response<ProjectData> {
    try {
      const data: ProjectData | null = await this.store.getItem(projectSlug);
      if (data) return {
        success: true,
        data
      };

      return {
        success: false,
        message: "Project not found."
      };
    }
    catch (e) {
      console.error("[stores][projects_data][getProjectData]", e);

      return {
        success: false,
        message: "An error occured.",
        debug: {
          error: e
        }
      };
    }
  }

  /** Update or create an entry in the local database. */
  async updateProjectData (
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
    catch (e) {
      console.error("[stores][projects_data][updateProjectData]", e);

      return {
        success: false,
        message: `Error while saving the project data of "${slug}"`,
        debug: {
          error: e
        }
      };
    }
  }

  async createEmptyProjectData (slug: string): Response<ProjectData> {
    try {
      const empty_project_data: ProjectData = {
        launchpads: [],
        files: {},
        
        /** 120 is the default BPM. */
        global_bpm: 120
      };

      const stored_data: ProjectData = await this.store.setItem(slug, empty_project_data);
      return {
        success: true,
        data: stored_data
      };
    }
    catch (e) {
      console.error("[stores][projects_data][createEmptyProjectData]", e);
      return {
        success: false,
        message: `Error while creating the project data of "${slug}".`,
        debug: {
          error: e
        }
      };
    }
  }

  async deleteProjectData (slug: string) {
    try {
      await this.store.removeItem(slug);
      return true;
    }
    catch (e) {
      console.error("[stores][projects_data][deleteProjectData]", e);
      return false;
    }
  }
}

export const storedProjectsData = new StoredProjectsDataStore("lpadder");