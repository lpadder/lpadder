import { createStore } from "solid-js/store";
import { Midi, MidiJSON } from "@tonejs/midi";

import Launchpad from "@/components/Device";
import Select from "@/components/Select";
import FileInput from "@/components/FileInput";

import { devicesConfiguration, convertNoteLayout } from "@/utils/devices";
import { novationLaunchpadPalette } from "@/utils/palettes";

import { webMidiDevices, webMidiInformations } from "@/stores/webmidi";
import { JSX } from "solid-js";

interface GroupedNotes {
  notes: {
    /** In MS. */
    duration: number;
    /** Between 0 and 1. */
    velocity: number;
    /** MIDI note. */
    midi: number;
  }[];

  /** In MS. */
  start_time: number;
}

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
      const notesData = loadMidiData(midi_data);

      // Store the MIDI object and the parsed notes.
      setState({ midi: midiObject, note_groups: notesData, loaded: true });
    };

    reader.readAsArrayBuffer(file);
  };

  const loadMidiData = (midi_data: MidiJSON) => {
    /** Notes of the first track of the MIDI file. */
    const notes_data = midi_data.tracks[0].notes;

    /**
     * Here, we group the notes by time to setup the
     * setTimeouts for each group, when needed to.
     */
    const grouped_notes: GroupedNotes[] = [];

    /**
     * Delay in MS. Kind of a "hack" to prevent pads from blinking.
     * TODO: Make it configurable.
     */
    const delay = 20;

    // Group the notes by time.
    notes_data.forEach(note => {
      const start_time = note.time * 1000;
      const duration = (note.duration * 1000) + delay;

      const convert_results = convertNoteLayout(note.midi, "drum_rack", "programmer");
      if (!convert_results.success) return;

      const midi = convert_results.note;

      const parsed_note: typeof grouped_notes[number]["notes"][number] = {
        velocity: note.velocity,
        duration,
        midi
      };

      // Find the group.
      const group = grouped_notes.find(
        group => group.start_time === start_time
      );

      // If the group doesn't exist, create it.
      if (!group) {
        grouped_notes.push({
          start_time,
          notes: [parsed_note]
        });

        return;
      }

      group.notes.push(parsed_note);
    });

    return grouped_notes;
  };

  /** Play the MIDI file on the selected output. */
  const playMidi = () => {
    if (!state.note_groups) return;
    const device = selectedDevice();

    state.note_groups.forEach(group => {
      const start_time = group.start_time;
      const leds =
        group.notes.map(note => ({
          note: note.midi,
          color: novationLaunchpadPalette[note.velocity * 127]
        }));

      if (device) {
        const sysex = deviceConfiguration().rgb_sysex(leds);
        device.output.sendSysex([], sysex, {
          time: `+${start_time}`
        });
      }

      /** Setup the timing for all the `noteon`s at `start_time`. */
      setTimeout(() => {
        group.notes.forEach(note => {
          const color = novationLaunchpadPalette[note.velocity * 127];
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
                  note: note.midi, color: novationLaunchpadPalette[0]
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
        <p class="text-gray-400">
          This utility takes any MIDI file and shows a preview of
          it on the browser and on a selected Launchpad output.
        </p>
      </header>

      <form
        class="mb-8 mx-auto w-max p-6 rounded-lg bg-gradient-to-tr from-blue-600 to-pink-600 shadow-lg"
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
          </Show>

          <div class="relative max-w-md rounded-lg h-auto sm:w-64 sm:h-64 mx-auto p-3 border-2 border-gray-900 bg-gray-900 bg-opacity-40 shadow-lg">
            <Launchpad
              ref={launchpad_ref}
              linkedDevice={selectedDevice()}
              defaultDeviceType={"launchpad_pro_mk2_cfy"}
              onPadDown={() => null}
              onPadUp={() => null}
            />
          </div>

          <button
            class="px-4 py-2 rounded-lg bg-gray-900 font-medium"
            onClick={playMidi}
          >
            Play MIDI
          </button>
        </div>
      </Show>
    </div>
  );
}
