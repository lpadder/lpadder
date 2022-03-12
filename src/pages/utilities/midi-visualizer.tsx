import { useState } from "react";
import { Midi } from "@tonejs/midi";

import Launchpad from "@/components/Launchpad";

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
    console.log(midi_data);
  };

  return (
    <div>
      <h2>
        Launchpad MIDI visualizer
      </h2>

      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          MIDI file:
          <input
            type="file"
            accept=".mid"
            onChange={onFileChange}
          />
        </label>
      </form>

      {loaded && midi && (
        <div>
          <h3>
            {midi.header.name || "Untitled"}
          </h3>

          <div
            className="w-[90%] h-auto sm:w-auto sm:h-64 mx-auto"
          >
            <Launchpad
              launchpadId={0}
              onPadDown={() => null}
              onPadUp={() => null}
            />
          </div>


          <button
            onClick={playMidi}
          >
            Play
          </button>
        </div> 
      )}
    </div>
  );
}