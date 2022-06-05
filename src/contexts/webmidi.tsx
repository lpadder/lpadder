import type { Input, Output } from "webmidi";
import type { ParentComponent } from "solid-js";

import { createSignal, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export type InputsData = { [id: string]: Input };
export type OutputsData = { [id: string]: Output };

const [informations, setInformations] = createStore<{
  /**
   * Whether the `enableAndSetup` function
   * was called, at least, once or not at all.
   */
  wasRequested: boolean;
  
  /**
   * Whether webmidi is enabled or not.
   * If not, we should show a retry button
   * else the user can't use the app.
   */
  isEnabled: boolean;
}>({
  wasRequested: false,
  isEnabled: false
});

const [inputs, setInputs] = createSignal<InputsData>({});
const [outputs, setOutputs] = createSignal<OutputsData>({});

const store = {
  informations: { get: informations, set: setInformations },
  inputs: { get: inputs, set: setInputs },
  outputs: { get: outputs, set: setOutputs }
} as const;

type WebMidiContextType = typeof store;
export const WebMidiContext = createContext<WebMidiContextType>(store);
export const useWebMidiContext = () => useContext(WebMidiContext);

export const WebMidiProvider: ParentComponent = (props) => {
  return (
    <WebMidiContext.Provider value={store}>
      {props.children}
    </WebMidiContext.Provider>
  );
};
