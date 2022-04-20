import { WebMidi } from "webmidi";
import { useWebMidiStore } from "@/stores/webmidi";

/**
 * Enables WebMidi and gets every Inputs and Outputs
 * then stores them in the WebMidi store.
 */
export const enableAndSetup = async () => {
  try {
    await WebMidi.enable();

    const { inputs, outputs } = WebMidi;
    const store = useWebMidiStore.getState();

    store.setInputs(inputs);
    store.setOutputs(outputs);

    WebMidi.addListener("connected", (device) => {
      
    });

    store.setIsEnabled(true);
  }
  catch (e) {
    console.error("[WebMidi] Cannot setup an instance.", e);
  }
};

// export const 