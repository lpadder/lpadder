import type { Component } from "solid-js";

import Device from "@/components/Device";
import Select from "@/components/Select";

import { devicesConfiguration } from "@/utils/devices";

import { webMidiDevices } from "@/stores/webmidi";

const TicTacToeGame: Component = () => {
  /**
   * Device init logic
   */
  const [state, setState] = createStore<{
    selectedDeviceIndex: number
  }>({
    selectedDeviceIndex: 0
  });

  const linkedDevice = () => webMidiDevices()[state.selectedDeviceIndex];
  const deviceConfiguration = () => devicesConfiguration[linkedDevice().type || "launchpad_pro_mk2_cfy"];

  let device_ref: HTMLDivElement | undefined;

  /**
   * Game logic
  */
  const [gameStarted, setGameStart] = createSignal(false);
  const [playerNumber, setPlayerNumber] = createSignal(1);
  const [gameWon, setGameWon] = createSignal(false);

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

  /** Handler for pad press */
  const onPadDown = (note: number) => {
    if (gameStarted()) gameLoop(note);
  };

  /** Handler for pad lift (when press is over) */
  const onPadUp = () => {
    if (gameStarted()) return;
  };

  /** Lights up a pad of a specified note number in a specified color */
  const lightUpPad = (note: number, color: number[]) => {
    if (!device_ref) return;
    const device = linkedDevice();

    const device_element = device_ref.querySelector(`[data-note="${note}"]`) as HTMLDivElement;
    if (!device_element) return;

    if (device) {
      const sysex = deviceConfiguration().rgb_sysex([{ note, color: color }]);
      device.output.sendSysex([], sysex);
    }

    device_element.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  };

  /** Clears the pad of the specified note param */
  const clearPad = (note: number) => {
    if (!device_ref) return;
    const device = linkedDevice();

    const device_element = device_ref.querySelector(`[data-note="${note}"]`) as HTMLDivElement;
    if (!device_element) return;

    if (device) {
      const sysex = deviceConfiguration().rgb_sysex([{ note, color: [0, 0, 0] }]);
      device.output.sendSysex([], sysex);
    }

    device_element.style.backgroundColor = "rgb(148, 163, 184)";
  };

  /** Clears all the pads */
  const clearAllButtons = () => {
    for (let index = 0; index < 98; index++) {
      clearPad(index);
    }
  };

  /** Init logic for starting the game */
  const startGame = () => {
    if (gameStarted()) return;

    setGameStart(true);
    setGameWon(false);
    clearGameGrid();
    setPlayerNumber(1);
  };

  /** Draws the game grid */
  const drawGameGrid = () => {
    const gridNotes = [13, 23, 33, 43, 53, 63, 73, 83, // First vertical row (left)
      16, 26, 36, 46, 56, 66, 76, 86, // Second vertical row (right)
      31, 32, 34, 35, 37, 38, // First horizontal row (bottom)
      61, 62, 64, 65, 67, 68]; // Second horizontal row (top)


    gridNotes.forEach(note => {
      lightUpPad(note, [255, 255, 255]);
    });

  };

  /** Clears all pads and draws a new grid */
  const clearGameGrid = () => {
    clearAllButtons();
    drawGameGrid();
  };

  /** Logic which is called on every move (button press) */
  const gameLoop = (note: number) => {
    const pressedFieldIndex = returnPressedField(note);

    if (!device_ref) return;
    const device_element = device_ref.querySelector(`[data-note="${note}"]`) as HTMLDivElement;
    if (!device_element) return;

    if (device_element.style.backgroundColor === "rgb(0, 42, 255)" || device_element.style.backgroundColor === "rgb(255, 0, 0)") {
      console.log("Cannot place field here, it is already occupied."); // TODO: Add a sound or visible error

      // Set color of pad once again, only on Launchpad to prevent weird behavior
      const rgbString = device_element.style.backgroundColor.replace(/[^\d,]/g, "").split(",");
      const rgb = rgbString.map(str => {
        return Number(str);
      });
      fillPressedField(pressedFieldIndex, [rgb[0], rgb[1], rgb[2]]);

      return;
    }

    // If note is not in valid fields, return
    if (!validFields.find(field => field.includes(note))) return;

    fillPressedField(pressedFieldIndex);
    checkForWinner();
    if (gameWon()) return;

    playerNumber() === 1 ? setPlayerNumber(2) : setPlayerNumber(1);
  };

  /** Check filled fields of current player to check if there is a winning combination after they placed a field */
  const checkForWinner = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    const currentFilledFields = getFilledFieldsOfCurrentPlayer();
    winningCombinations.forEach(element => {
      if (currentFilledFields.includes(element[0]) && currentFilledFields.includes(element[1]) && currentFilledFields.includes(element[2])) {
        console.log("Player " + playerNumber() + " won!");
        setGameWon(true);
        setGameStart(false);
      }
    });
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

  /** Return array of indices of filled fields (from 0-8) */
  const getFilledFieldsOfCurrentPlayer = () => {
    const filledFields: number[] = [];
    const currentPlayerColor = playerNumber() === 1 ? [0, 42, 255] : [255, 0, 0];

    validFields.forEach((field: number[], index: number) => {
      field.forEach((note: number) => {
        if (!device_ref) return;
        const device_element = device_ref.querySelector(`[data-note="${note}"]`) as HTMLDivElement;
        if (device_element.style.backgroundColor === `rgb(${currentPlayerColor[0]}, ${currentPlayerColor[1]}, ${currentPlayerColor[2]})`) {
          if (filledFields.includes(index)) return;

          filledFields.push(index);
        }
      });
    });

    return filledFields;
  };

  /** Fill field of the specified index with the specified color */
  const fillPressedField = (fieldIndex: number, color?: [number, number, number]) => {
    if (fieldIndex === -1) return;

    let fillColor: [number, number, number] = playerNumber() === 1 ? [0, 42, 255] : [255, 0, 0];
    if (color) fillColor = color;

    validFields[fieldIndex].forEach((field: number) => {
      lightUpPad(field, (fillColor || color));
    });
  };

  return (
    <>
      <Title>lpadder - tic tac toe game</Title>
      <div id="game" class="flex flex-col items-start my-8 mx-8">
        <A href="/games" class="flex flex-center justify-center bg-opacity-60 rounded-lg transition-colors hover:bg-opacity-80 mb-2 group">
          <IconMdiArrowBack class="mr-1 group-hover:text-sky-500" />
          <span class="group-hover:text-sky-500">Go back</span>
        </A>
        <h1 class="text-4xl font-bold mb-1">Tic Tac Toe</h1>
        <span class="mb-8">Play a game of TicTacToe against a friend, right on your Launchpad!</span>
        <div id="main-frame" class="flex flex-row gap-12">
          <div id="launchpad-frame">
            <div class="relative bg-slate-900 p-2 h-[32rem] w-[32rem] rounded-md">
              <Device
                ref={device_ref}
                linkedDevice={linkedDevice()}
                defaultDeviceType={"launchpad_pro_mk2_cfy"}
                onPadUp={onPadUp}
                onPadDown={onPadDown}
              />
            </div>
            <div class="flex flex-col items-center w-full">
              <Show when={!gameStarted()}>
                <button class="w-full p-2 bg-slate-700 hover:bg-slate-600 mt-4 rounded-md" onClick={startGame}>{gameWon() ? "Play Again" : "Start Game"}</button>
              </Show>
              <button class="mt-2 hover:text-sky-500" onClick={clearAllButtons}>Clear Launchpad Output</button>
            </div>
          </div>
          <div id="info-frame">
            <h2 class="text-2xl font-bold">Game status</h2>
            <p>Status: {gameStarted() ? "Playing" : "Game stopped"}</p>
            <Show when={gameStarted() && !gameWon()}>
              <p class="mt-8 italic tracking-wide text-xl text-sky-300">It is Player {playerNumber()}'s turn! (color: {playerNumber() === 1 ? "blue" : "red"})</p>
            </Show>
            <Show when={gameWon()}>
              <p class="mt-8 font-bold tracking-wide text-4xl text-fuchsia-600">Player {playerNumber()} won!</p>
            </Show>
            <h2 class="text-2xl font-bold mt-8 mb-4">Settings</h2>
            <label for="dropdown">Output device:</label>
            <Select
              id="dropdown"
              title="Select an output..."
              onChange={e => setState({ selectedDeviceIndex: parseInt(e.currentTarget.value) })}
            >
              <option value="none">
                None
              </option>

              <For each={webMidiDevices()}>{(device, deviceIndex) => (
                <option value={deviceIndex()}>
                  {device.name}
                </option>
              )}</For>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicTacToeGame;
