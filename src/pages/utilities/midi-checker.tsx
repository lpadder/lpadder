import { useEffect, useState } from "react";
import { WebMidi, Input, Output } from "webmidi";


export default function UtilitiesMidiChecker () {
  const [webMidiEnabled, setWebMidiEnabled] = useState(false);

  useEffect(() => {
    console.group("[midi-checker][useEffect]");
    console.info("-> Starting WebMidi...");

    WebMidi
      .enable()
      .then (() => {
        console.info("<- Successfully enabled !");
        console.groupEnd();

        // Update WebMidi state.
        setWebMidiEnabled(true);
      })
      .catch (err => {
        console.error("<- An error was thrown.", err);
        console.groupEnd();

        alert("An error happenned, check console.");
      });
  }, []);

  const [availableInputs, setAvailableInputs] = useState<Input[]>([]);
  const [availableOutputs, setAvailableOutputs] = useState<Output[]>([]);

  /** Refresh available devices when WebMidi enabled. */
  useEffect(() => {
    refreshAvailableDevices();
  }, [webMidiEnabled]);

  /** Function to refresh 'availableDevices' state */
  const refreshAvailableDevices = () => {
    if (!webMidiEnabled) return;

    // Get the devices.
    const { inputs, outputs } = WebMidi;

    // Store them to states.
    setAvailableInputs(inputs);
    setAvailableOutputs(outputs);
  
    // Debug in console.
    console.group("[refreshAvailableDevices] Refreshed states.");
    console.info("Inputs", inputs);
    console.info("Outputs", outputs);
    console.groupEnd();
  };

  return (
    <div>
      <h1>MIDI Checker</h1>

      {!webMidiEnabled && (
        <div>
          <p>Loading WebMidi...</p>
        </div> 
      )}

      <h2>Send MIDI</h2>
      
    </div>
  );
}
