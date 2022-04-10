import type {
  ProjectStoredStructure,
  ProjectStructure
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
class StoredProjectsStore {
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

  async getProjectFromSlug (slug: string): Response<ProjectStructure> {
    try {
      const project: ProjectStructure | null = await this.store.getItem(slug);
      if (project) return {
        success: true,
        data: project
      };

      return {
        success: false,
        message: "Project not found."
      };
    }
    catch (e) {
      console.error("[stores][projects][getProjectFromSlug]", e);

      return {
        success: false,
        message: `Error while getting the project of slug "${slug}"`,
        debug: {
          error: e
        }
      };
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
  ): Response<ProjectStoredStructure> {
    try {
      const savedData: ProjectStructure = await this.store.setItem(slug, data);
      return {
        success: true,
        data: {
          slug,
          data: savedData
        }
      };
    }
    catch (e) {
      console.error("[stores][projects][updateProject]", e);
      return {
        success: false,
        message: `Error while saving the project of slug "${slug}"`,
        debug: {
          error: e
        }
      };
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
  }: {
    name: string;
    slug: string;
    authors?: string[];
    launchpadders?: string[];
  }): Response<ProjectStoredStructure> {
    if (!name || !slug) return {
      success: false,
      message: "Name and slug are required."
    };
    
    // Defining an empty project.
    const project: ProjectStructure = {
      // Version of lpadder is defined globally, see `global.d.ts`.
      version: import.meta.env.DEV ? "next" : APP_VERSION,

      name,
      authors,
      launchpadders,
      
      // Empty cover data.
      launchpads: [],
      assets: []
    };

    // Check if the slug already exists.
    const { success: alreadyExists } = await this.getProjectFromSlug(slug);
    if (alreadyExists) return {
      success: false,
      message: "A project with this slug already exists."
    };

    // Store the new project.
    const created_project = await this.updateProject(slug, project);
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
export const storedProjects = new StoredProjectsStore("lpadder");

interface LocalProjectsStore {
  localProjects: ProjectStoredStructure[] | null;
  setLocalProjects: (data: ProjectStoredStructure[]) => void;
}

/**
 * This store is used to store every projects
 * that was in the localForage.
 */
export const useLocalProjectsStore = create<LocalProjectsStore>((set) => ({
  localProjects: null,
  setLocalProjects: (data) => set({ localProjects: data })
}));

interface CurrentProjectStore {
  /** Is the project saved globally and locally. */
  isSaved: boolean;
  currentProject: ProjectStoredStructure | null;
  setIsSaved: (value: boolean) => void;
  setCurrentProject: (data: ProjectStoredStructure | null) => void;

  /**
   * Takes the current project data and put it in the
   * localProjects and the stored projects.
   */
   updateGlobally: () => Promise<void>
}

/**
 * Store used when a project is opened.
 * We use this store to keep track of the current project.
 */
export const useCurrentProjectStore = create<CurrentProjectStore>((set, get) => ({
  isSaved: true,
  currentProject: null,
  setIsSaved: (value: boolean) => set({ isSaved: value }),
  setCurrentProject: (data) => set({
    currentProject: data,
    isSaved: false
  }),

  updateGlobally: async () => {
    const projectData = get().currentProject;
    if (!projectData) return;

    // Store the current project in the localForage.
    const update_project = await storedProjects.updateProject(projectData.slug, projectData.data);
    if (!update_project.success) return;

    const localProjects = useLocalProjectsStore.getState().localProjects;
    const updatedLocalProjects =  [ ...(localProjects || []) ];
    const projectToUpdateIndex = updatedLocalProjects.findIndex(
      project => project.slug === update_project.data.slug
    );

    updatedLocalProjects[projectToUpdateIndex] = {
      slug: update_project.data.slug,
      data: update_project.data.data
    };

    // Store the current project in local projects.
    useLocalProjectsStore.getState().setLocalProjects(updatedLocalProjects);

    // Set the current project as saved (locally and globally).
    set({ isSaved: true });
  }
}));