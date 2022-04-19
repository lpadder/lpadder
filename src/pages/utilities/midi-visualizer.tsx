import { useState, useEffect } from "react";
import { Midi } from "@tonejs/midi";

import Launchpad, { getPadElementId } from "@/components/Launchpad";
import Select from "@/components/Select";
import FileInput from "@/components/FileInput";

import LaunchpadLayout from "@/utils/LaunchpadLayout";
import { getHexFromVelocity } from "@/utils/novationPalette";
import chroma from "chroma-js";
import { WebMidi, Output } from "webmidi";


export default function UtilitiesMidiVisualizer () {
  const [loaded, setLoaded] = useState(false);
  const [midi, setMidi] = useState<null | Midi>(null);

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

      // Set the midi state.
      setMidi(midiObject);

      // Set the loaded state.
      setLoaded(true);
    };
    
    reader.readAsArrayBuffer(file);
  };

  const playMidi = () => {
    if (!midi || !loaded) return;

    const midi_data = midi.toJSON();
    const layouts = new LaunchpadLayout();

    console.log("Starting playback...");

    const output = selectedOutput ? availableOutputs.find(output => output.id === selectedOutput) : null;
    if (output) console.log("Also playing the playback on the selected output:", output.name);

    // TODO: Maybe a track selector ?
    /** Notes of the first track of the MIDI file. */
    const notes = midi_data.tracks[0].notes;
    for (const note of notes) {
      const convertResults = layouts.convertNoteLayout(note.midi, "live", "programmer");
      if (!convertResults.success) continue;
      
      const color = getHexFromVelocity(note.velocity * 127);
      const pad_element_id = getPadElementId(convertResults.result, 0);
      const pad = document.getElementById(pad_element_id);
      if (!pad) continue;

      const start_time = note.time * 1000;
      const duration = note.duration * 1000;
      // Here the `+20` is a "hack" to prevent HTML pads from blinking.
      const duration_start_time = start_time + duration + 20;

      setTimeout(() => {
        pad.style.backgroundColor = color;
        output?.playNote(convertResults.result, {
          duration,
          attack: note.velocity,
          release: note.velocity
        });
      }, start_time);
      
      setTimeout(() => {
        // Check if another color haven't taken the pad.
        if (chroma(pad.style.backgroundColor).hex() === color) {
          pad.removeAttribute("style");
        }
      }, duration_start_time);
    }
  };
 
  const [selectedOutput, setSelectedOutput] = useState<string | null>(null);
  const [webMidiEnabled, setWebMidiEnabled] = useState(false);
  const [availableOutputs, setAvailableOutputs] = useState<Output[]>([]);
  const refreshAvailableOutputs = () => {
    // Clean the current states.
    setAvailableOutputs([]);
  
    // Get the devices.
    const { outputs } = WebMidi;
    setAvailableOutputs(outputs);
  };
  
  useEffect(() => {
    console.group("[midi-checker][useEffect] Enable.");
  
    const loadWebMidi = async () => {
      console.info("-> Starting WebMidi...");
  
      return WebMidi
        .enable()
        .then (() => {
          console.info("<- Successfully enabled !");
          console.groupEnd();
  
          // Update WebMidi state.
          setWebMidiEnabled(true);
          refreshAvailableOutputs();          
        })
        .catch (err => {
          console.error("<- An error was thrown.", err);
          console.groupEnd();
  
          alert("An error happenned, check console.");
        });
    };
  
    const disableWebMidi = async () => {
      console.info("-> Disabling WebMidi...");
  
      return WebMidi
        .disable()
        .then (() => {
          console.info("<- Successfully disabled !");
          console.groupEnd();
  
          // Update WebMidi state.
          setWebMidiEnabled(false);
          setAvailableOutputs([]);
        })
        .catch (err => {
          console.error("<- An error was thrown.", err);
          console.groupEnd();
  
          alert("An error happenned, check console.");
        });
    };
  
    if (!webMidiEnabled) loadWebMidi();
    else {
      console.info("<- WebMidi is already enabled ! Reloading it...");
      disableWebMidi().then(() => loadWebMidi());
    }
  
    return () => {
      console.group("[midi-checker][useEffect] Clean-up.");
      disableWebMidi();
    };
  }, []);

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
              onChange={(e) => setSelectedOutput(e.target.value)}
            >
              <option value="none">
            None
              </option>

              {availableOutputs.map(output => (
                <option
                  key={output.id}
                  value={output.id}
                > {output.name} </option>
              ))}
            </Select>
          )}

          <div
            className="max-w-md rounded-lg h-auto sm:w-64 sm:h-64 mx-auto p-4 border-2 border-gray-900 bg-gray-900 bg-opacity-40 shadow-lg"
          >
            <Launchpad
              layout="programmer"
              launchpadId={0}
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