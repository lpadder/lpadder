import type {
  ProjectLoadedMetadata,
  ProjectMetadata
} from "../types/Project";

import localforage from "localforage";
import create from "zustand";

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
class StoredProjectsMetadataStore {
  private store: LocalForage;

  constructor (databaseName: string) {
    this.store = localforage.createInstance({
      storeName: "projects-metadata",
      name: databaseName
    });
  }

  /**
   * Get every project from the
   * local database in an array.
   */
  public async getProjectsMetadata () {
    const projects: ProjectLoadedMetadata[] = [];

    // Iterate every key/value from the database.
    await this.store.iterate((projectMetadata: ProjectMetadata, projectSlug) => {
      projects.push({
        slug: projectSlug,
        metadata: projectMetadata
      });
    });
  
    return projects;
  }

  async getProjectMetadataFromSlug (projectSlug: string): Response<ProjectMetadata> {
    try {
      const data: ProjectMetadata | null = await this.store.getItem(projectSlug);
      if (data) return {
        success: true,
        data
      };

      return {
        success: false,
        message: "Project not found."
      };
    }
    catch (error) {
      return {
        success: false,
        message: "An error occured.",
        debug: error
      };
    }
  }

  /** Update or create an entry in the local database. */
  async updateProjectMetdata (
    slug: string,
    data: ProjectMetadata
  ): Response<ProjectLoadedMetadata> {
    try {
      const stored_metadata: ProjectMetadata = await this.store.setItem(slug, data);

      return {
        success: true,
        data: {
          slug,
          metadata: stored_metadata
        }
      };
    }
    catch (e) {
      console.error("[stores][projects_metadata][updateProjectMetadata]", e);

      return {
        success: false,
        message: `Error while saving the project of slug "${slug}"`,
        debug: {
          error: e
        }
      };
    }
  }

  async deleteProjectMetadata (slug: string) {
    try {
      await this.store.removeItem(slug);
      return true;
    }
    catch (e) {
      /** Debug */ console.error("[stores][projects_metadata][deleteProjectMetadata]", e);
      return false;
    }
  }

  async createEmptyProjectMetdata (slug: string, {
    name,
    authors = [],
    launchpadders = []
  }: {
    name: string;
    authors?: string[];
    launchpadders?: string[];
  }): Response<ProjectLoadedMetadata> {
    if (!name || !slug) return {
      success: false,
      message: "Name and slug are required."
    };
    
    // Defining an empty project.
    const project: ProjectMetadata = {
      // Version of lpadder is defined globally, see `global.d.ts`.
      version: import.meta.env.DEV ? "next" : APP_VERSION,

      name,
      authors,
      launchpadders
    };

    // Check if the slug already exists.
    const { success: alreadyExists } = await this.getProjectMetadataFromSlug(slug);
    if (alreadyExists) return {
      success: false,
      message: "A project with this slug already exists."
    };

    // Store the new project.
    const created_project = await this.updateProjectMetdata(slug, project);
    if (!created_project.success) return {
      success: false,
      message: "Error while creating the project.",
      debug: {
        response: created_project
      }
    };

    return {
      success: true,
      data: created_project.data
    };
  }
}

/** localForage store wrapped with some utility functions. */
export const storedProjectsMetadata = new StoredProjectsMetadataStore("lpadder");

interface LocalProjectsStore {
  localProjectsMetadata: ProjectLoadedMetadata[] | null;
  setLocalProjectsMetadata: (data: ProjectLoadedMetadata[] | null) => void;
}

/**
 * This store is used to store every projects
 * that was in the localForage.
 */
export const useLocalProjectsStore = create<LocalProjectsStore>((set) => ({
  localProjectsMetadata: null,
  setLocalProjectsMetadata: (data) => set({ localProjectsMetadata: data })
}));