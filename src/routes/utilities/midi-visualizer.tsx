import type { JSX } from "solid-js";
import type { GroupedNotes } from "@/types/Midi";

import { createStore } from "solid-js/store";
import { Midi } from "@tonejs/midi";

import Launchpad from "@/components/Device";
import Select from "@/components/Select";
import FileInput from "@/components/FileInput";

import { parseMidiData } from "@/utils/midi";
import { devicesConfiguration } from "@/utils/devices";
import { DEFAULT_NOVATION_PALETTE } from "@/utils/palettes";

import { webMidiDevices, webMidiInformations } from "@/stores/webmidi";

export default function UtilitiesMidiVisualizer () {
  let launchpad_ref: HTMLDivElement | undefined;

  const [state, setState] = createStore<{
    loaded: boolean,
    midi: Midi | null,
    note_groups: GroupedNotes[] | null,

    selectedDeviceIndex: number
  }>({
    loaded: false,
    midi: null,
    note_groups: null,
    selectedDeviceIndex: 0
  });

  const selectedDevice = () => webMidiDevices()[state.selectedDeviceIndex];
  const deviceConfiguration = () => devicesConfiguration[selectedDevice().type || "launchpad_pro_mk2_cfy"];

  /** When a file is uploaded, parse and load it.  */
  const onFileChange: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
    /** Reset the state to prepare the new one. */
    setState({ loaded: false, midi: null });

    // Check if a MIDI file was given.
    if (!event.currentTarget.files || !event.currentTarget.files[0]) return;

    // Get the MIDI file.
    const file = event.currentTarget.files[0];

    // Parse the MIDI file.
    const reader = new FileReader();
    reader.onload = () => {
      const midiBuffer = reader.result as ArrayBuffer;
      const midiObject = new Midi(midiBuffer);

      // Parse the notes.
      const midi_data = midiObject.toJSON();
      const notesData = parseMidiData(midi_data);

      // Store the MIDI object and the parsed notes.
      setState({ midi: midiObject, note_groups: notesData, loaded: true });
    };

    reader.readAsArrayBuffer(file);
  };



  /** Play the MIDI file on the selected output. */
  const playMidi = () => {
    if (!state.note_groups) return;
    const device = selectedDevice();

    state.note_groups.forEach((group) => {
      const start_time = group.start_time;
      const leds =
        group.notes.map((note) => ({
          note: note.midi,
          color: note.color
        }));

      if (device) {
        const sysex = deviceConfiguration().rgb_sysex(leds);
        device.output.sendSysex([], sysex, {
          time: `+${start_time}`
        });
      }

      /** Setup the timing for all the `noteon`s at `start_time`. */
      setTimeout(() => {
        group.notes.forEach((note) => {
          const color = note.ui_color;
          const duration = note.duration;

          // Get the Launchpad element.
          if (!launchpad_ref) return;
          const launchpad = launchpad_ref;

          // Get the pad element from the Launchpad.
          const pad: HTMLDivElement | null = launchpad.querySelector(`[data-note="${note.midi}"]`);
          if (!pad) return;

          /** Browsers always convert values to RGB according to some spec. (TODO: [source ?](#)) */
          const colored_pad_style = `rgb(${color.join(", ")})`;

          // Set the color of the pad for the `noteon`.
          pad.style.backgroundColor = colored_pad_style;

          // Setup the timing for the `noteoff`.
          setTimeout(() => {
            const current_style = pad.style.backgroundColor;
            if (!current_style) return;

            /**
             * Check if the pad haven't been triggered.
             * If triggered with another color, then we do nothing
             * and let the other trigger, handle everything.
             * If it's still the same color, we remove it.
             */
            if (current_style === colored_pad_style) {
              // Remove the color of the pad for the `noteoff`.
              pad.removeAttribute("style");
              if (device) {
                const sysex = deviceConfiguration().rgb_sysex([{
                  note: note.midi, color: DEFAULT_NOVATION_PALETTE[0]
                }]);
                device.output.sendSysex([], sysex);
              }
            }
          }, duration);
        });
      }, start_time);
    });
  };

  return (
    <div>
      <header
        class="mb-8 m-auto text-center max-w-xl"
      >
        <h1 class="font-medium text-2xl">
          Launchpad MIDI Visualizer
        </h1>
        <p class="text-slate-400">
          This utility takes any MIDI file and shows a preview of
          it on the browser and on a selected Launchpad output.
        </p>
      </header>

      <form
        class="mb-8 mx-auto w-max p-6 rounded-lg bg-gradient-to-tr from-sky-600 to-fuchsia-600 shadow-lg"
        onSubmit={(e) => e.preventDefault()}
      >
        <FileInput
          label="MIDI file (.mid)"
          onChange={onFileChange}
          accept=".mid"
          multiple={false}
        />
      </form>

      <Show when={state.loaded && state.midi}>
        <div class="max-w-xl mx-auto text-center space-y-4 mb-8">
          <h3 class="font-medium text-xl">
            <b class="font-bold">MIDI</b>: {state.midi?.header.name || "Untitled"}
          </h3>

          <Show when={webMidiInformations.isEnabled}>
            <Select
              title="Select an output..."
              onChange={(e) => setState({ selectedDeviceIndex: parseInt(e.currentTarget.value) })}
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
          </Show>

          <div class="relative max-w-md rounded-lg h-auto sm:w-64 sm:h-64 mx-auto p-3 border-2 border-slate-900 bg-slate-900 bg-opacity-40 shadow-lg">
            <Launchpad
              ref={launchpad_ref}
              linkedDevice={selectedDevice()}
              defaultDeviceType={"launchpad_pro_mk2_cfy"}
              onPadDown={() => null}
              onPadUp={() => null}
            />
          </div>

          <button
            class="px-4 py-2 rounded-lg bg-slate-900 font-medium"
            onClick={playMidi}
          >
            Play MIDI
          </button>
        </div>
      </Show>
    </div>
  );
}
