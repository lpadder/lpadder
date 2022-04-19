export type AvailableLayouts = 
  | "programmer"
  | "live";

type LayoutValueType = number[][];

export default class LaunchpadLayout {
  public layouts: {
    live: LayoutValueType;
    programmer: LayoutValueType;
  };

  constructor () {
    const liveLayout = this.buildLiveLayout();
    const programmerLayout = this.buildProgrammerLayout();

    // Build layouts and store them in `this.layouts`.
    this.layouts = {
      live: liveLayout,
      programmer: programmerLayout
    };
  }

  /** Build the layout for the Live mode. */
  private buildLiveLayout(): LayoutValueType {
    const layout = [];

    for (let columns = 64; columns >= 36; columns -= 4) {
      const column = [];

      for (let rows = 0; rows <= 7; rows++) {
        let id = columns + rows;

        // After 4 it goes to the next "side" (+32) and get back to 0 (-4)
        if (rows >= 4) {
          id += 32 - 4;
        }

        // Insert the column
        column.push(id);
      }

      // Push the column to layout
      layout.push(column);
    }

    return layout;
  }

  /** Build the layout for the Programmer mode. */
  private buildProgrammerLayout(): LayoutValueType {
    const layout = [];

    for (let columns = 8; columns >= 1; columns--) {
      const column = [];

      for (let rows = 1; rows <= 8; rows++) {
        const id = `${columns}${rows}`;
        column.push(parseInt(id));
      }

      layout.push(column);
    }

    return layout;
  }

  /** Convert a midi note ex: MIDI note 88 from Live to Programmer mode. */
  public convertNoteLayout (
    note: number,
    from: AvailableLayouts,
    to: AvailableLayouts
  ): { success: true, result: number } | { success: false, message: string } {
    // Search in the `from` layout the note.
    for (const [index_col, columns] of this.layouts[from].entries()) {
      const index = columns.indexOf(note);

      if (index !== -1) {
        const result = this.layouts[to][index_col][index];

        return {
          success: true,
          result
        };
      }
    }

    // No result.
    return {
      success: false,
      message: "No result found."
    };
  }
}
