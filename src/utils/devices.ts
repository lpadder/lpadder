import type { Output, Input, MessageEvent } from "webmidi";

export type DeviceGridPadType = {
  isPhantom?: boolean;
  isCircle?: boolean;
  id: number;
}
export type DeviceLayoutGridType = number[][];

export type DeviceType =
  | "launchpad_pro_mk3"
  | "launchpad_mini_mk3"
  | "launchpad_pro_mk2"
  | "launchpad_pro_mk2_cfw" // Old CFW
  | "launchpad_pro_mk2_cfy" // Latest CFW
  | "launchpad_mk2"
  | "launchpad_mini_mk2"
  | "launchpad_x"

/** Private function to build the `drum_rack` layout. */
const buildDrumRackLayout = (): DeviceLayoutGridType => {
  console.info("building drum_rack layout...");
  let layout = [];

  for (let columns = 64; columns >= 36; columns -= 4) {
    const column = [];

    for (let rows = 0; rows <= 7; rows++) {
      let pad = columns + rows;

      // After the 4 pads it goes to the next "side" (+32) and gets back to 0 (-4)
      if (rows >= 4) {
        pad += 32 - 4;
      }

      // Insert the pad to the column.
      column.push(pad);
    }

    // Insert the column to the layout.
    layout.push(column);
  }

  // Build the controls.
  layout = layout.map((row, row_index) => {
    return [
      // Right column goes from 108 to 115 (top to bottom).
      108 + row_index,
      ...row,
      // Left column goes from 100 to 107 (top to bottom).
      100 + row_index];
  });

  /** The top row goes from 28 to 35. */
  const top_row = Array.from({ length: 8 }, (_, id) => id + 28);
  /** The bottom row goes from 116 to 123. */
  const bottom_row = Array.from({ length: 8 }, (_, id) => id + 116);

  return [
    [-1, ...top_row, -1],
    ...layout,
    [-1, ...bottom_row, -1]
  ];
};

/**  Private function to build the full `programmer` layout. */
const buildProgrammerLayout = (): DeviceLayoutGridType => {
  console.info("building programmer layout...");
  let layout = [];

  // Build the grid.
  for (let columns = 8; columns >= 1; columns--) {
    const column = [];

    for (let rows = 1; rows <= 8; rows++) {
      const id = `${columns}${rows}`;
      column.push(parseInt(id));
    }

    layout.push(column);
  }

  // Build the controls.
  layout = layout.map((row, row_index) => {
    return [
      // Right column goes from 80 to 10 (top to bottom).
      80 - 10 * row_index,
      ...row,
      // Left column goes from 89 to 19 (top to bottom).
      89 - 10 * row_index];
  });

  /** The top row goes from 91 to 98. */
  const top_row = Array.from({ length: 8 }, (_, id) => id + 91);
  /** The bottom row goes from 1 to 8. */
  const bottom_row = Array.from({ length: 8 }, (_, id) => id + 1);

  return [
    [-1, ...top_row, -1],
    ...layout,
    [-1, ...bottom_row, -1]
  ];
};

/**
 * Private function to build the `live_drum_rack` layout.
 * This layout is only used to parse drum racks in Ableton.
 */
const buildLiveDrumRackLayout = (): DeviceLayoutGridType => {
  console.info("building live_drum_rack layout...");
  const layout = [];

  for (let columns = 92; columns >= 64; columns -= 4) {
    const column = [];

    for (let rows = 0; rows <= 7; rows++) {
      let id = columns - rows;

      // After 4 it goes to the next "side" (-32) and get back to 0 (-4)
      if (rows >= 4) {
        id -= 32 - 4;
      }

      // Insert the column
      column.push(id);
    }

    // Push the column to layout
    layout.unshift(column);
  }

  return layout;
};

export const layouts = {
  drum_rack: buildDrumRackLayout(),
  programmer: buildProgrammerLayout(),
  live_drum_rack: buildLiveDrumRackLayout()
};

export interface DeviceProperty {
  name: string;

  /** SysEx to be sended when the device is connected or linked. */
  initialization_sysex: (number[])[];

  /** Function to get the SysEx sequence to send RGB to the device. */
  rgb_sysex: (note: number, [r, g, b]: number[]) => number[];

  layout_to_use: DeviceLayoutGridType;
}

export const devicesConfiguration: { [Property in DeviceType]: DeviceProperty } = {
  launchpad_pro_mk2: {
    name: "Launchpad Pro MK2",

    /** Taken from <https://github.com/203Electronics/Prismatic/blob/master/src/deviceConfigs.js#L7-L11>. */
    initialization_sysex: [
      // Enter "Live" mode.
      [0, 32, 41, 2, 16, 33, 0],
      // Clear canvas.
      [0, 32, 41, 2, 16, 14, 0],
      // Turn off "mode" light.
      [0, 32, 41, 2, 16, 10, 99, 0]
    ],

    rgb_sysex: (note, [r, g, b]) => [
      0, 32, 41, 2, 16, 11, note, r >> 2, g >> 2, b >> 2
    ],

    layout_to_use: layouts["programmer"]
  },

  get launchpad_pro_mk2_cfw () {
    return {
      ...this.launchpad_pro_mk2,
      name: "Launchpad Pro MK2 (Outdated CFW)",

      /** Taken from <https://github.com/203Electronics/Prismatic/blob/master/src/deviceConfigs.js#L145-L148>. */
      initialization_sysex: [
        // Enter "Performance" mode.
        [0, 32, 41, 2, 16, 33, 1],
        // Clear canvas.
        [0, 32, 41, 2, 16, 14, 0]
      ]
    };
  },

  /** Same as `launchpad_pro_cfw` but updated. */
  get launchpad_pro_mk2_cfy () {
    return {
      ...this.launchpad_pro_mk2_cfw,
      name: "Launchpad Pro MK2 (CFW)"
    };
  },

  launchpad_x: {
    name: "Launchpad X",

    /** Taken from <https://github.com/203Electronics/Prismatic/blob/master/src/deviceConfigs.js#L332-L334>. */
    initialization_sysex: [
      // Enter "Programmer" mode.
      [0, 32, 41, 2, 12, 14, 1]
    ],

    rgb_sysex: (note, [r, g, b]) => [
      0, 32, 41, 2, 12, 3, 3, note, r >> 1, g >> 1, b >> 1
    ],

    get layout_to_use () {
      let layout = layouts["programmer"];

      layout = layout.map((row, rowIndex) => {
        // Remove the first item, since we don't have left column.
        row.shift();

        // Add the `99` pad on the last item in the first row (0)
        if (rowIndex === 0) row[row.length - 1] = 99;
        return row;
      });

      // Remove the last row since we don't have the bottom row.
      layout.pop();

      return layout;
    }
  },

  launchpad_pro_mk3: {
    name: "Launchpad Pro MK3",

    initialization_sysex: [
      // Enter "Programmer" mode.
      [0, 32, 41, 2, 12, 14, 0, 17, 0]
    ],

    layout_to_use: layouts["programmer"]
  },

  launchpad_mk2: {
    name: "Launchpad MK2",
    initialization_sysex: [],
    layout_to_use: layouts["programmer"]
  },

  launchpad_mini_mk2: {
    name: "Launchpad Mini MK2",
    initialization_sysex: [],
    layout_to_use: layouts["drum_rack"]
  },

  launchpad_mini_mk3: {
    name: "Launchpad Mini MK3",
    initialization_sysex: [],
    layout_to_use: layouts["programmer"]
  }
};

/**
 * This is a function taken from mat1jaczyyy's LP-Firmware-Utility.
 * You can see it here, <https://github.com/mat1jaczyyy/LP-Firmware-Utility/blob/master/web/src/classes/Launchpad.ts#L22-L42>.
 */
export const guessDeviceType = (output: Output, input: Input): Promise<DeviceType | undefined> => {
  return new Promise((resolve) => {
    const listenerTimer = setTimeout(() => {
      input.removeListener("sysex", inputSysexEventHandler);
      resolve(undefined);
    }, 1000);

    const inputSysexEventHandler = async (evt: MessageEvent) => {
      clearTimeout(listenerTimer);
      input.removeListener("sysex", inputSysexEventHandler);

      let type: DeviceType | undefined;

      /**
       * Now, this part is also taken from mat1jaczyyy's LP-Firmware-Utility.
       * You can see it here, <https://github.com/mat1jaczyyy/LP-Firmware-Utility/blob/master/web/src/classes/Launchpad.ts#L44-L120>.
       */
      if (evt.message.data.length === 17) {
        const msg = evt.message.data.slice(1, evt.message.data.length - 1);

        if (msg[4] === 0x00 && msg[5] === 0x20 && msg[6] === 0x29) {
          switch (msg[7]) {
          // Launchpad X
          case 0x03: {
            if (msg[8] === 17) type = "launchpad_x";
            else if (msg[8] === 1) type = "launchpad_x";
            break;
          }

          // Launchpad Mini MK3
          case 0x13: {
            if (msg[8] === 17) type = "launchpad_mini_mk3";
            else if (msg[8] === 1) type = "launchpad_mini_mk3";
            break;
          }

          // Launchpad Pro MK3
          case 0x23: {
            if (msg[8] === 17) type = "launchpad_pro_mk3";
            else if (msg[8] === 1) type = "launchpad_pro_mk3";
            break;
          }

          // Launchpad MK2
          case 0x69: {
            type = "launchpad_mk2";
            break;
          }

          // Launchpad Pro
          case 0x51: {
            const versionStr = msg
              .slice(msg.length - 3)
              .reduce((prev: string, current: number) =>
                prev + String.fromCharCode(current), ""
              );

            switch (versionStr) {
            case "cfw":
            case "cfx": {
              type = "launchpad_pro_mk2_cfw";
              break;
            }
            case "cfy": {
              type = "launchpad_pro_mk2_cfy";
              break;
            }
            default: {
              type = "launchpad_pro_mk2";
              break;
            }
            }
            break;
          }
          }
        }
      }

      resolve(type);
    };

    input.addListener("sysex", inputSysexEventHandler);
    output.sendSysex([], [0x7e, 0x7f, 0x06, 0x01]);
  });
};

export const convertNoteLayout = (
  note: number,
  from: keyof (typeof layouts),
  to: keyof (typeof layouts)
): { success: true, result: number } | { success: false, message: string } => {
  // Search in the `from` layout the note.
  for (const [index_col, columns] of layouts[from].entries()) {
    const index = columns.indexOf(note);

    if (index !== -1) {
      const result = layouts[to][index_col][index];

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
};
