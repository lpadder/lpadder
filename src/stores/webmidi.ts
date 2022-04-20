import type {
  Input, Output
} from "webmidi";

import create from "zustand";

interface WebMidiStore {
  isEnabled: boolean;
  setIsEnabled: (isEnabled: boolean) => void;

  inputs: Input[];
  outputs: Output[];  
  setInputs: (inputs: Input[]) => void;
  setOutputs: (outputs: Output[]) => void;  
}

export const useWebMidiStore = create<WebMidiStore>((set) => ({
  isEnabled: false,
  setIsEnabled: (isEnabled) => set(() => ({ isEnabled })),

  inputs: [],
  outputs: [],
  setInputs: (inputs) => set(() => ({ inputs })),
  setOutputs: (outputs) => set(() => ({ outputs }))
}));
