import type {
  InputsData,
  OutputsData
} from "@/contexts/webmidi";

import { WebMidi } from "webmidi";
import { useWebMidiContext } from "@/contexts/webmidi";

/**
 * Takes a WebMidi instance in parameter and refresh every `Inputs`
 * and `Outputs` of the `webMidiStore` with values of that instance.
 */
const refreshDevices = (midi: typeof WebMidi) => {
  const { inputs, outputs } = midi;
  const webMidi = useWebMidiContext();

  /** Get inputs as an object of `input.id: input`. */
  const parsed_inputs: InputsData = inputs.reduce(
    (obj, input) => ({ ...obj, [input.id]: input }), {}
  );

  /** Get outputs as an object of `output.id: output`. */
  const parsed_outputs: OutputsData = outputs.reduce(
    (obj, output) => ({ ...obj, [output.id]: output }), {}
  );

  // We keep the refreshed inputs/outputs in the store.
  webMidi.devicesSignal.set({
    inputs: parsed_inputs,
    outputs: parsed_outputs
  });

  console.info("[utils/webmidi] Store and connections refreshed !");
};

/**
 * Enable WebMidi and get every Inputs and Outputs
 * then store them in the WebMidi store.
 * 
 * Should be executed when the app is mounted, see `src/main.tsx`.
 * Returns a Promise<boolean>, so if we can't setup an instance,
 * we restrict some features that requires webmidi.
 */
export const enableAndSetup = async () => {
  const webMidi = useWebMidiContext();
  
  try {
    const midi = await WebMidi.enable();

    // Listen to changes on Inputs and Outputs.
    midi.addListener("connected", (event) => refreshDevices(event.target as typeof WebMidi));
    midi.addListener("disconnected", (event) => refreshDevices(event.target as typeof WebMidi));

    // Store every Inputs and Outputs already connected.
    refreshDevices(midi);

    console.info("[utils/webmidi] Succesfully enabled !");
    webMidi.informationsStore.set({ isEnabled: true, wasRequested: true });
    return true;
  }
  catch (error) {
    console.error("[utils/webmidi] Not able to enable webmidi. Try to check if your browser supports webmidi.", error);
    webMidi.informationsStore.set({ isEnabled: false, wasRequested: true });
    return false;
  }
};
