import type { Output, Input, MessageEvent } from "webmidi";

export type DeviceLayoutType = number[][];

export type DeviceType =
  | "launchpad_pro_mk3"
  | "launchpad_mini_mk3"
  | "launchpad_pro"
  | "launchpad_pro_cfw" // Old CFW
  | "launchpad_pro_cfy" // Latest CFW
  | "launchpad_mk2"
  | "launchpad_mini"
  | "launchpad_x"

/** Private function to build the `drum_rack` layout. */
const buildDrumRackLayout = (): DeviceLayoutType => {
  console.info("building drum_rack layout...");
  const layout = [];

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

  return layout;
};

/** Private function to build the `programmer` layout. */
const buildProgrammerLayout = (): DeviceLayoutType => {
  console.info("building programmer layout...");
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
};

/**
 * Private function to build the `live_drum_rack` layout.
 * This layout is only used to parse drum racks in Ableton.
 */
const buildLiveDrumRackLayout = (): DeviceLayoutType => {
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

  layout_to_use: DeviceLayoutType;
}

export const devices: { [Property in DeviceType]: DeviceProperty } = {
  launchpad_pro: {
    name: "Launchpad Pro",

    initialization_sysex: [
      [0, 32, 41, 2, 16, 33, 0], // Enter Live Mode
      [0, 32, 41, 2, 16, 14, 0], // Clear canvas
      [0, 32, 41, 2, 16, 10, 99, 0] // Turn off Mode light
    ],

    layout_to_use: layouts["drum_rack"]
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
              type = "launchpad_pro_cfw";
              break;
            }
            case "cfy": {
              type = "launchpad_pro_cfy";
              break;
            }
            default: {
              type = "launchpad_pro";
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
