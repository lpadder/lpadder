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
 * Content of a project that is stored in
 * a `project.json` file or in localForage.
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

  /** Author(s) of the music. */
  authors: string[];
  /** Creator(s) of the project. */
  creators: string[];

  /** Height of the preview canvas. */
  canvasHeight: number;
  /** Width of the preview canvas. */
  canvasWidth: number;
  /** View position of the preview canvas. */
  defaultCanvasViewPosition: { x: number, y: number };
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
