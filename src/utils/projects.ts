import type { ProjectData, ProjectMetadata, ProjectStructure } from "@/types/Project";
import type { Response } from "@/types/Globals";

import { currentProjectStore, projectSaved, setProjectSaved } from "@/stores/current_project";
import { projectsDataLocal } from "@/stores/projects_data";
import { setModalsStore } from "@/stores/modals";
import {
  projectsMetadataLocal,
  setProjectsMetadataStore
} from "@/stores/projects_metadata";

import { produce, unwrap } from "solid-js/store";

import { log, error, logStart, logEnd } from "@/utils/logger";
import JSZip from "jszip";

/** Saves the current project to localForage. */
export const syncProjectDataGlobally = async () => {
  const current_project = currentProjectStore;

  if (!current_project.slug || !current_project.data) {
    error("save", "project is not loaded in `current_project`.");
    return false;
  }

  if (projectSaved()) {
    log("save", "already saved. skipping...");
    return true;
  }

  /** Here, we use `unwrap` to get rid of the proxy. */
  const project_data = unwrap(current_project.data);

  logStart("save", "updating the localForage...");
  const update_response = await projectsDataLocal.update(
    current_project.slug, project_data
  );
  logEnd("save");

  if (!update_response.success) {
    error("save", "an error was thrown while saving to localForage.", update_response.debug);
    return false;
  }

  setProjectSaved(true);
  return true;
};

/**
 * Checks the project's version with lpadder's version.
 *
 * When the version matchs, it returns `{ success: true }`.
 *
 * When it doesn't match, we request to GitHub the deploy URL
 * of the required verison to run the project.
 *
 * When the deploy URL is found, it returns `{ success: false, deploy_url: string }`.
 * When not found, it returns `{ success: false, message: string }`.
 */
export const checkProjectVersion = async (version: string) => {
  if (
    // We don't check the project version on the development environment.
    APP_VERSION !== "next" &&
    // We don't check if the project version is from the development environment.
    version !== "next" &&
    // We check if the project version is not matching with lpadder version.
    version !== APP_VERSION
  ) {
    const release_url = `https://api.github.com/repos/Vexcited/lpadder/releases/tags/v${version}`;
    const release_response = await fetch(release_url);

    const release_data = await release_response.json() as {
      /** Content of the release. */
      body?: string;
      /** Only when an error was thrown. */
      message?: string;
    };

    if (release_data.message || !release_data.body) {
      return {
        success: false,
        message: "GitHub API Error: " + release_data.message
      } as const;
    }

    const deploy_url_regex = /Deployment URL: <(.*)>/;
    const deploy_url_results = release_data.body.match(deploy_url_regex);

    if (!deploy_url_results || !deploy_url_results[1]) {
      return {
        success: false,
        message: "Deployment URL wasn't found !"
      } as const;
    }

    const deploy_url = deploy_url_results[1];

    return {
      success: false,
      deploy_url
    } as const;
  }

  return { success: true } as const;
};

/**
 * Takes a `slug` parameter and creates a new project with that slug.
 * @param extra - When string, it's the project's name; else, it's the project's data and metadata.
 */
export const createNewProject = async (
  slug: string,
  extra: string | { data: ProjectData, metadata: ProjectMetadata }
): Promise<Response<undefined>> => {
  if (!slug) return {
    success: false,
    message: "Slug is required."
  };

  // Check if the project's slug already exists.
  const { success: alreadyExists } = await projectsMetadataLocal.get(slug);
  if (alreadyExists) return {
    success: false,
    message: "A project with this slug already exists."
  };

  const data: ProjectData = typeof extra !== "string" ? extra.data : {
    launchpads: [],
    files: {},

    /** 120 is the default BPM. */
    global_bpm: 120
  };

  const metadata: ProjectMetadata = typeof extra !== "string" ? extra.metadata : {
    name: extra, // Here, we use `extra` as the project's name.
    authors: [],
    creators: [],

    // Version of lpadder is defined globally, see `@/global.d.ts`.
    version: import.meta.env.DEV ? "next" : APP_VERSION,

    // The default values of the canvas is the user's window height and width.
    canvasHeight: window.innerHeight,
    canvasWidth: window.innerWidth,

    // The default values of the canvas view position is middle (x=0, y=0)
    defaultCanvasViewPosition: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      scale: 1 // Default zoom/scale.
    }
  };

  // Update the data localForage.
  const data_response = await projectsDataLocal.update(slug, data);
  if (!data_response.success) return data_response;

  // Update the metadata localForage.
  const metadata_response = await projectsMetadataLocal.update(slug, metadata);
  if (!metadata_response.success) return metadata_response;

  // Update the metadata store.
  setProjectsMetadataStore(
    produce((store => {
      store.metadatas.push({ slug, metadata });
    }))
  );

  return {
    success: true,
    data: undefined
  };
};

/** Takes a `slug` parameter and deletes the corresponding project. */
export const deleteProject = async (slug: string): Promise<Response<undefined>> => {
  if (!slug) return {
    success: false,
    message: "Slug is required."
  };

  // Update the data localForage.
  const data_response = await projectsDataLocal.delete(slug);
  if (!data_response.success) return data_response;

  // Update the metadata localForage.
  const metadata_response = await projectsMetadataLocal.delete(slug);
  if (!metadata_response.success) return metadata_response;

  // Update the metadata store.
  setProjectsMetadataStore(
    produce((store => {
      const index = store.metadatas.findIndex(metadata => metadata.slug === slug);
      if (index !== -1) store.metadatas.splice(index, 1);
    }))
  );

  return {
    success: true,
    data: undefined
  };
};

/**
 * Creates an input file then handles it and opens the import modal.
 *
 * Before opening the import modal, we check if the version of
 * the project matches with lpadder's version. If it doesn't, we open
 * the wrong version modal.
 */
export const createImportProject = () => {
  const fileInput = document.createElement("input");
  fileInput.setAttribute("type", "file");
  fileInput.setAttribute("hidden", "true");

  /** Only accept ".zip" files. */
  fileInput.setAttribute("accept", ".zip");

  fileInput.addEventListener("change", () => {
    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const zip_content = await JSZip.loadAsync(arrayBuffer);

      const coverDataFile = zip_content.file("cover.json");
      if (!coverDataFile) return console.error(
        "This zip file doesn't contain a `cover.json` file in root directory."
      );

      const coverData = await coverDataFile.async("string");
      const parsedCoverData: ProjectStructure = JSON.parse(coverData);

      /**
       * Check if the project's version matches
       * with lpadder's version except on development.
       */
      const version_data = await checkProjectVersion(parsedCoverData.metadata.version);
      if (!version_data.success) {

        // When the deploy URL is found.
        if (version_data.deploy_url) {
          setModalsStore({
            lpadderWrongVersionModal: true,
            lpadderWrongVersionModalData: {
              success: true,
              required_version: parsedCoverData.metadata.version,
              data: version_data.deploy_url
            }
          });
        }

        // When the deploy URL isn't found.
        else {
          setModalsStore({
            lpadderWrongVersionModal: true,
            lpadderWrongVersionModalData: {
              success: false,
              required_version: parsedCoverData.metadata.version,
              data: version_data.message || "Deployment URL can't be found."
            }
          });
        }

        return;
      }

      setModalsStore({
        importProjectModal: true,
        importProjectModalData: parsedCoverData
      });
    };

    const files = fileInput.files;
    if (files && files.length > 0) {
      reader.readAsArrayBuffer(files[0]);
    }
  });

  document.body.append(fileInput);
  fileInput.click();
  fileInput.remove();
};
