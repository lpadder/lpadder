import { useState, useEffect } from "react";
import { Midi, MidiJSON } from "@tonejs/midi";

import Launchpad from "@/components/Launchpad";
import Select from "@/components/Select";
import FileInput from "@/components/FileInput";

import LaunchpadLayout from "@/utils/LaunchpadLayout";
import { getHexFromVelocity } from "@/utils/novationPalette";
import chroma from "chroma-js";

import { useWebMidiStore } from "@/stores/webmidi";
import { useRef } from "react";

interface GroupedNotes {
  notes: {
    /** in MS. */
    duration: number;
    /** Between 0 and 1. */
    velocity: number;
    midi: number;
  }[];
  
  /** in MS. */
  start_time: number;
}

export default function UtilitiesMidiVisualizer () {
  const [loaded, setLoaded] = useState(false);
  const [midi, setMidi] = useState<null | Midi>(null);
  const [notes, setNotes] = useState<null | GroupedNotes[]>(null);
  const launchpadRef = useRef<HTMLDivElement>(null);

  const [selectedOutputId, setSelectedOutput] = useState<string>("none");
  
  const webMidiEnabled = useWebMidiStore(state => state.isEnabled);
  const [availableOutputs, setAvailableOutputs] = useState(useWebMidiStore.getState().outputs);
  useEffect(() => useWebMidiStore.subscribe(
    state => setAvailableOutputs(state.outputs)
  ), []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset the loaded state (to prepare the new one).
    setLoaded(false);
    setMidi(null);

    // Check if a MIDI file was given.
    if (!e.target.files || !e.target.files[0]) return;

    // Get the MIDI file.
    const file = e.target.files[0];

    // Parse the MIDI file.
    const reader = new FileReader();
    reader.onload = () => {
      const midiBuffer = reader.result as ArrayBuffer;
      const midiObject = new Midi(midiBuffer);
      const midi_data = midiObject.toJSON();

      const notesData = loadMidiData(midi_data);

      // Store the MIDI object.
      setMidi(midiObject);

      // Store the parsed MIDI data.
      setNotes(notesData);

      setLoaded(true);
    };
    
    reader.readAsArrayBuffer(file);
  };

  const loadMidiData = (midi_data: MidiJSON) => {
    const layouts = new LaunchpadLayout();

    // TODO: Maybe a track selector ?
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

      const convert_results = layouts.convertNoteLayout(note.midi, "live", "programmer");
      if (!convert_results.success) return;
      
      const midi = convert_results.result;

      const parsed_note: typeof grouped_notes[number]["notes"][number] = {
        velocity: note.velocity,
        duration,
        midi,
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

  const playMidi = () => {
    if (!notes) return;

    // Get the output device if choosen.
    const output = selectedOutputId ? availableOutputs[selectedOutputId] : null;

    notes.forEach(group => {
      const start_time = group.start_time;
      
      /** Setup the timing for all the `noteon`s at `start_time`. */
      setTimeout(() => {
        group.notes.forEach(note => {
          const color = getHexFromVelocity(note.velocity * 127);
          const duration = note.duration;
  
          // Get the Launchpad element.
          if (!launchpadRef.current) return;
          const launchpad = launchpadRef.current;
          
          // Get the pad element from the Launchpad.
          const pad: HTMLDivElement | null = launchpad.querySelector(`[data-note="${note.midi}"]`);
          if (!pad) return;

          // Set the color of the pad for the `noteon`.
          pad.style.backgroundColor = color;
          output?.playNote(note.midi, {
            attack: note.velocity
          });
  
          // Setup the timing for the `noteoff`.
          setTimeout(() => {
            const style = pad.style.backgroundColor;
            if (!style) return;

            const style_hex = chroma(style).hex();

            // Check if the current pad color
            // matches the color of the `noteon`.
            //
            // If it doesn't match, it's because
            // another `noteon` has been played on it.
            if (style_hex === color) {
              // Remove the color of the pad for the `noteoff`.
              pad.removeAttribute("style");
              output?.stopNote(note.midi);
            }
          }, duration);
        });
      }, start_time);
    });
  };
  
  return (
    <div>
      <header
        className="mb-8 m-auto text-center max-w-xl"
      >
        <h1 className="font-medium text-2xl">
          Launchpad MIDI Visualizer
        </h1>
        <p className="text-gray-400">
          This utility takes any MIDI file and shows a preview of
          it on the browser and on a selected Launchpad output.
        </p>
      </header>

      <form
        className="mb-8 mx-auto max-w-fit p-6 rounded-lg bg-gradient-to-tr from-blue-600 to-pink-600 shadow-lg"
        onSubmit={(e) => e.preventDefault()}
      >
        <FileInput
          label="MIDI file (.mid)"
          onChange={onFileChange}
          accept=".mid"
          multiple={false}
        />
      </form>

      {loaded && midi && (
        <div className="max-w-xl mx-auto text-center space-y-4 mb-8">
          <h3 className="font-medium text-xl">
            <b className="font-bold">MIDI</b>: {midi.header.name || "Untitled"}
          </h3>

          {webMidiEnabled && (
            <Select
              placeholder="Select an output..."
              value={selectedOutputId}
              onChange={(e) => setSelectedOutput(e.target.value)}
            >
              <option value="none">
                None
              </option>

              {Object.keys(availableOutputs).map(output_id => (
                <option
                  key={output_id}
                  value={output_id}
                > {availableOutputs[output_id].name} </option>
              ))}
            </Select>
          )}

          <div
            className="max-w-md rounded-lg h-auto sm:w-64 sm:h-64 mx-auto p-4 border-2 border-gray-900 bg-gray-900 bg-opacity-40 shadow-lg"
          >
            <Launchpad
              ref={launchpadRef}
              layout="programmer"
              onPadDown={() => null}
              onPadUp={() => null}
            />
          </div>

          <button
            className="px-4 py-2 rounded-lg bg-gray-900 font-medium"
            onClick={playMidi}
          >
            Play MIDI
          </button>
        </div> 
      )}
    </div>
  );
}