export interface GroupedNotes {
  notes: {
    /** In MS. */
    duration: number;

    /** Between 0 and 127. */
    velocity: number;

    /** [r, g, b] color for the UI. */
    ui_color: number[];
    /** [r, g, b] color for the devicce. */
    color: number[];

    /** MIDI note. */
    midi: number;
  }[];

  /** In MS. */
  start_time: number;
}
