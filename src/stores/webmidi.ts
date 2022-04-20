import type {
  Input, Output
} from "webmidi";

import create from "zustand";

export type InputsData = { [id: string]: Input };
export type OutputsData = { [id: string]: Output };

interface WebMidiStore {
  isEnabled: boolean;
  setIsEnabled: (isEnabled: boolean) => void;

  inputs: InputsData;
  outputs: OutputsData;

  setInputs: (inputs: InputsData) => void;
  setOutputs: (outputs: OutputsData) => void; 

  /** Function that groups `setInputs` and `setOutputs` in one. */
  setIO: (options: { inputs: InputsData, outputs: OutputsData }) => void;
}

export const useWebMidiStore = create<WebMidiStore>(set => ({
  isEnabled: false,
  setIsEnabled: (isEnabled) => set(() => ({ isEnabled })),

  inputs: {},
  outputs: {},

  setInputs: (inputs) => set(() => ({ inputs })),
  setOutputs: (outputs) => set(() => ({ outputs })),

  setIO: ({ inputs, outputs }) => set(() => ({ inputs, outputs })),
}));
