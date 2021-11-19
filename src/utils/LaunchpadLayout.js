export class LaunchpadLayout {
  constructor () {
    const liveLayout = this.buildLiveLayout();
    const programmerLayout = this.buildProgrammerLayout();

    this.layouts = {
      live: liveLayout,
      programmer: programmerLayout
    };
  }

  buildLiveLayout() {
    const layout = [];

    for (let columns = 64; columns >= 36; columns -= 4) {
      let column = [];

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

  buildProgrammerLayout() {
    const layout = [];

    for (let columns = 8; columns >= 1; columns--) {
      let column = [];

      for (let rows = 1; rows <= 8; rows++) {
        let id = `${columns}${rows}`;
        column.push(parseInt(id));
      }

      layout.push(column);
    }

    return layout;
  }

  /**
   * Convert a midi note ex: MIDI note 88 from Live to Programmer mode. 
   * @param {number} note
   * @param {"live" | "programmer"} from
   * @param {"live" | "programmer"} to
   * @returns {[boolean, number | null]}
   */
  convertLayout (note, from, to) {
    // Search in the `from` layout the note.
    this.layouts[from].map((rows, indexRows) => {
      let index = rows.indexOf(note);
      if (index !== -1) {
        const result = this.layouts[to][indexRows][index];
        return [true, result];
      }
    });

    // No result.
    return [false, null];
  }
}
