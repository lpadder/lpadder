import type { Input, Output } from "webmidi";
import { createStore } from "solid-js/store";

export type InputsData = { [id: string]: Input };
export type OutputsData = { [id: string]: Output };

interface WebMidiStore {
  isEnabled: boolean;

  inputs: InputsData;
  outputs: OutputsData;
}

export const [webMidiStore, setWebMidiStore] = createStore<WebMidiStore>({
  isEnabled: false,

  inputs: {},
  outputs: {}
});
