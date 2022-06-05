import type { Input, Output } from "webmidi";
import { createStore } from "solid-js/store";
import { createSignal } from "solid-js";

export type InputsData = { [id: string]: Input };
export type OutputsData = { [id: string]: Output };

interface WebMidiInformationsType {
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
}

export const [webMidiInformations, setWebMidiInformations] = createStore<WebMidiInformationsType>({
  wasRequested: false,
  isEnabled: false
});

export const [webMidiInputs, setWebMidiInputs] = createSignal<InputsData>({});
export const [webMidiOutputs, setWebMidiOutputs] = createSignal<OutputsData>({});
