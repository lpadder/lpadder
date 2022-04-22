export interface ProjectDataSample {
  /** Optionnal friendly name for this sample - because why not ?-? */
  name?: string;

  // TODO: Metadatas for the sample (audio and lightshow).
}

export interface ProjectData {
  /** Data used for launchpads handling. */
  launchpads: {
    /** Name of the launchpad (more friendly than default: `Launchpad 0`) */
    name: string;

    pages: {
      /** Name of the page. */
      name: string;

      /** Samples of the page. */
      samples: {
        [pad_id: number]: ProjectDataSample;
      }
    }[];
  }[];

  files: {
    [relativePath: string]: {
      /** File name, extension isn't required. */
      name: string;

      /** Note: should always have a trailling slash ! */
      path: string;

      /** Note: not available when importing. */
      data: ArrayBuffer;

      /**
       * MIME of the audio file.
       * Required at export to recompose file names with
       * proper extensions for them.
       */
      type: string; 
    }
  }

  global_bpm: number;
}

/**
 * Content of a cover that is stored in
 * a `cover.json` file or in localForage.
 */
export interface ProjectMetadata {
  /**
   * Version of lpadder supported for this project.
   * It corresponds to the version on the home page `/`
   * or to the "version" field in `package.json`.
   * 
   * When a version don't match, we show a modal 
   * redirecting to the latest build of the version.
   */
  version: string;

  /** Project's name. */
  name: string;

  /** Cover music author(s). */
  authors: string[];
  /** Creator(s) of the cover. */
  launchpadders: string[];
}

/** Used when the projects' metadata are preloaded. */
export interface ProjectLoadedMetadata {
  slug: string;
  metadata: ProjectMetadata;
}

export interface ProjectStructure {
  metadata: ProjectMetadata;
  data: ProjectData;
}