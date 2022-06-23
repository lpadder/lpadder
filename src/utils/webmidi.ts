import { InputsData, OutputsData } from "@/stores/webmidi";

import {
  setWebMidiInformations,
  setWebMidiInputs,
  setWebMidiOutputs
} from "@/stores/webmidi";

import { WebMidi } from "webmidi";
import { batch } from "solid-js";

/**
 * Takes a WebMidi instance in parameter and refresh the
 * list of devices that are in the store.
 */
const refreshDevices = (midi: typeof WebMidi) => {
  const { inputs, outputs } = midi;
  
  /** Get inputs as an object of `input.id: input`. */
  const parsed_inputs: InputsData = inputs.reduce(
    (obj, input) => ({ ...obj, [input.id]: input }), {}
  );

  /** Get outputs as an object of `output.id: output`. */
  const parsed_outputs: OutputsData = outputs.reduce(
    (obj, output) => ({ ...obj, [output.id]: output }), {}
  );

  /**
   * We keep the refreshed inputs/outputs in the store.
   * 
   * Usage of the `batch` method here is to update both at
   * the same time, so it doesn't trigger 2 renders on every refresh.
   */
  batch(() => {
    setWebMidiInputs(parsed_inputs);
    setWebMidiOutputs(parsed_outputs);
  });

  console.info("[utils/webmidi] Devices list refreshing...");
};

/**
 * Enable WebMidi and get every Inputs and Outputs IDs
 * then store them in the WebMidi store.
 * 
 * Should be executed when the app is mounted, see `src/main.tsx`.
 * Returns a `Promise<boolean>`, so if we can't setup an instance,
 * we restrict some features that requires webmidi.
 */
export const enableAndSetup = async () => {
  try {
    const midi = await WebMidi.enable({ sysex: true });

    // Listen to changes on Inputs and Outputs.
    midi.addListener("connected", (event) => refreshDevices(event.target as typeof WebMidi));
    midi.addListener("disconnected", (event) => refreshDevices(event.target as typeof WebMidi));

    // Store every Inputs and Outputs already connected.
    refreshDevices(midi);

    console.info("[utils/webmidi] Succesfully enabled !");
    setWebMidiInformations({ isEnabled: true, wasRequested: true });
    return true;
  }
  catch (error) {
    console.error("[utils/webmidi]", error);
    setWebMidiInformations({ isEnabled: false, wasRequested: true });
    return false;
  }
};
