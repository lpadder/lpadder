import type { Component } from "solid-js";

import Device from "@/components/Device";

import { devicesConfiguration } from "@/utils/devices";

import { webMidiDevices } from "@/stores/webmidi";

const TicTacToeGame: Component = () => {
  const devices = webMidiDevices();
  console.log(devices); // TODO: remove
  const device = devices[1];

  let device_ref: HTMLDivElement | undefined;

  const validFields = [
    [11, 12, 21, 22],
    [14, 15, 24, 25],
    [17, 18, 27, 28],
    [41, 42, 51, 52],
    [44, 45, 54, 55],
    [47, 48, 57, 58],
    [71, 72, 81, 82],
    [74, 75, 84, 85],
    [77, 78, 87, 88]
  ];

  const linkedDevice = () => webMidiDevices().find(
    current_device => current_device.raw_name === device.raw_name
  );

  const deviceType = () => linkedDevice()?.type || device.type || "launchpad_pro_mk2_cfy";

  const onPadDown = (note: number) => {
    console.log("pog");
    if (!device_ref) return;
    const device = linkedDevice();

    const device_element = device_ref.querySelector(`[data-note="${note}"]`) as HTMLDivElement;
    if (!device_element) return;

    if (device) {
      const sysex = devicesConfiguration[device.type || "launchpad_pro_mk2_cfy"].rgb_sysex(note, [255, 255, 255]);
      device.output.sendSysex([], sysex);
    }

    device_element.style.backgroundColor = "rgb(255, 255, 255)";

    const noteT: number = returnPressedField(note);
    console.log(noteT.toString() + " poggies");
  };

  const onPadUp = (note: number) => {
    if (!device_ref) return;
    const device = linkedDevice();

    const device_element = device_ref.querySelector(`[data-note="${note}"]`) as HTMLDivElement;
    if (!device_element) return;

    if (device) {
      const sysex = devicesConfiguration[device.type || "launchpad_pro_mk2_cfy"].rgb_sysex(note, [0, 0, 0]);
      device.output.sendSysex([], sysex);
    }

    device_element.style.backgroundColor = "rgb(148, 163, 184)";
  };

  const startGame = () => {
    drawGameGrid();
  };

  const drawGameGrid = () => {
    const gridNotes = [13, 23, 33, 43, 53, 63, 73, 83, // First vertical row (left)
      16, 26, 36, 46, 56, 66, 76, 86, // Second vertical row (right)
      31, 32, 34, 35, 37, 38, // First horizontal row (bottom)
      61, 62, 64, 65, 67, 68]; // Second horizontal row (top)

    const device = linkedDevice();
    if (device) {
      gridNotes.forEach(note => {
        // First, set grid on actual launchpad
        const sysex = devicesConfiguration[device.type || "launchpad_pro_mk2_cfy"].rgb_sysex(note, [255, 255, 255]);
        device.output.sendSysex([], sysex);
        // Then, set the grid on the virtual launchpad
        if (!device_ref) return;
        const device_element = device_ref.querySelector(`[data-note="${note}"]`) as HTMLDivElement;
        if (!device_element) return;
        device_element.style.backgroundColor = "rgb(255, 255, 255)";
      });
    }
  };

  // Returns index of pressed field, or -1 if an invalid field is pressed
  const returnPressedField = (noteParam: number) => {
    let fieldIndex = -1;
    validFields.forEach((field: number[], index: number) => {
      field.forEach((note: number) => {
        if (note === noteParam) {
          fieldIndex = index;
        }
      });
    });

    return fieldIndex;
  };

  return (
    <>
      <Title>lpadder - tic tac toe game</Title>
      <div id="game" class="flex flex-col items-start my-8 mx-8">
        <Link href="/games" class="flex flex-center justify-center bg-opacity-60 rounded-lg transition-colors hover:bg-opacity-80 mb-2 group">
          <IconMdiArrowBack class="mr-1 group-hover:text-blue-500" />
          <span class="group-hover:text-blue-500">Go back</span>
        </Link>
        <h1 class="text-4xl font-bold mb-1">Tic Tac Toe</h1>
        <span class="mb-8">Play a game of TicTacToe against a friend, right on your Launchpad!</span>
        <div id="main-frame" class="flex flex-row gap-12">
          <div id="launchpad-frame">
            <div class="bg-gray-900 p-2 h-[32rem] w-[32rem] rounded-md">
              <Device
                ref={device_ref}
                linkedDevice={linkedDevice()}
                defaultDeviceType={deviceType()}
                onPadUp={onPadUp}
                onPadDown={onPadDown}
              />
            </div>
            <button class="w-full p-2 bg-gray-700 hover:bg-gray-600 my-4 rounded-md" onClick={startGame}>Start Game</button>
          </div>
          <div id="info-frame">
            <h2 class="text-2xl font-bold">Game status & settings</h2>
            <p>Status: playing</p>
            <p>It is Player 1's turn!</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicTacToeGame;
