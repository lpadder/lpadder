import type { NoteMessageEvent, ControlChangeMessageEvent } from "webmidi";
import type { InputsData, OutputsData } from "@/stores/webmidi";

import { WebMidi, Input } from "webmidi";
import { useWebMidiStore } from "@/stores/webmidi";

/**
 * Enables WebMidi and gets every Inputs and Outputs
 * then stores them in the WebMidi store.
 * 
 * Should be executed when the app starts, see `src/main.tsx`.
 */
export const enableAndSetup = async () => {
  try {
    const midi = await WebMidi.enable();

    // Listen to changes on Inputs and Outputs.
    midi.addListener("connected", (event) => refreshDevices(event.target as typeof WebMidi));
    midi.addListener("disconnected", (event) => refreshDevices(event.target as typeof WebMidi));

    // Store every Inputs and Outputs already connected.
    refreshDevices(midi);
    
    const store = useWebMidiStore.getState();
    store.setIsEnabled(true);

    console.log("[WebMidi] Enabled and running !");
  }
  catch (e) {
    console.error("[WebMidi] Cannot setup an instance.", e);
  }
};

/**
 * Takes a WebMidi instance in parameter and refresh every `Inputs`
 * and `Outputs` of the `webMidiStore` with values of that instance.
 */
export const refreshDevices = (midi: typeof WebMidi) => {
  const store = useWebMidiStore.getState();
  const { inputs, outputs } = midi;

  // TODO: Find a one-liner.
  const parsed_inputs: InputsData = {};
  for (const input of inputs) {
    parsed_inputs[input.id] = input;
  }
  
  // TODO: Find a one-liner.
  const parsed_outputs: OutputsData = {};
  for (const output of outputs) {
    parsed_outputs[output.id] = output;
  }

  // We save the new devices in the store.
  store.setIO({
    inputs: parsed_inputs,
    outputs: parsed_outputs
  });

  // Debug.
  console.log("[WebMidi] Devices refreshed !", inputs, outputs);
};

export const subscribeToInput = (
  input: Input,
  callback: (data: NoteMessageEvent | ControlChangeMessageEvent) => void
) => {
  input.addListener("noteon", callback);
  input.addListener("noteoff", callback);
  input.addListener("controlchange", callback);
};

export const unsubscribeToInput = (
  input: Input,
  callback: (data: NoteMessageEvent | ControlChangeMessageEvent) => void
) => {
  input.removeListener("noteon", callback);
  input.removeListener("noteoff", callback);
  input.removeListener("controlchange", callback);
};