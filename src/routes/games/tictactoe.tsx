import type { Component } from "solid-js";

import Device from "@/components/Device";

import { devicesConfiguration } from "@/utils/devices";

import { webMidiDevices } from "@/stores/webmidi";

const TicTacToeGame: Component = () => {
  const devices = webMidiDevices();
  console.log(devices); // TODO: remove
  const device = devices[1];

  let device_ref: HTMLDivElement | undefined;

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

  return (
    <>
      <Title>lpadder - tic tac toe game</Title>
      <div id="game" class="flex flex-col items-center my-8">
        <h1 class="text-4xl font-bold mb-8">Tic Tac Toe</h1>
        <div class="bg-gray-900 p-1 h-64 w-64 rounded-md">
          <Device
            ref={device_ref}
            linkedDevice={linkedDevice()}
            defaultDeviceType={deviceType()}
            onPadUp={onPadUp}
            onPadDown={onPadDown}
          />
        </div>
        <button class="p-2 bg-gray-700 hover:bg-gray-600 my-4 rounded-md" onClick={startGame}>Start Game</button>
      </div>
    </>
  );
};

export default TicTacToeGame;
