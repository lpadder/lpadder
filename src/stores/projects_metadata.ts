import type { Response } from "@/types/Globals";

import type {
  ProjectLoadedMetadata,
  ProjectMetadata
} from "@/types/Project";

import localforage from "localforage";
import { createStore } from "solid-js/store";

/** localForage store for persistance of projects' metadata. */
class ProjectsMetadataLocalStore {
  private store: LocalForage;

  constructor (databaseName: string) {
    this.store = localforage.createInstance({
      storeName: "projects-metadata",
      name: databaseName
    });
  }

  /** Gets all the projects metadata */
  async getAll () {
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

  async get (slug: string): Response<ProjectMetadata> {
    try {
      const data: ProjectMetadata | null = await this.store.getItem(slug);
      if (data) return {
        success: true,
        data
      };

      return {
        success: false,
        message: `Project metadata of "${slug}" not found.`
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

  /** Updates, or creates if not found, a project metadata in localForage. */
  async update (
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

  /** Deletes a project's metadata in localForage. */
  async delete (slug: string) {
    try {
      await this.store.removeItem(slug);
      return true;
    }
    catch (e) {
      /** Debug */ console.error("[stores][projects_metadata][deleteProjectMetadata]", e);
      return false;
    }
  }
}

/** localForage store wrapped with some utility functions. */
export const projectsMetadataLocal = new ProjectsMetadataLocalStore("lpadder");


/**
 * This store is used to preload
 * every metadata from localForage.
 */
export const [projectsMetadataStore, setProjectsMetadataStore] = createStore<ProjectLoadedMetadata[]>([]);
