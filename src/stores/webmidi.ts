import type { Input, Output } from "webmidi";
import { createStore } from "solid-js/store";

export type InputsData = { [id: string]: Input };
export type OutputsData = { [id: string]: Output };

interface WebMidiStore {
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

  inputs: InputsData;
  outputs: OutputsData;
}

export const [webMidiStore, setWebMidiStore] = createStore<WebMidiStore>({
  wasRequested: false,
  isEnabled: false,

  inputs: {},
  outputs: {}
});
