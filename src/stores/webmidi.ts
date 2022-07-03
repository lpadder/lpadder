import type { Input, Output } from "webmidi";
import type { DeviceType } from "@/utils/devices";

import { createStore } from "solid-js/store";

export interface ConnectedDeviceData {
  raw_name: string;
  guessed_type?: DeviceType;

  /** Same as `raw_name` when not customized. */
  name: string;
  /** Same as `guessed_type` when not customized. */
  type?: DeviceType;

  input: Input;
  output: Output;
}

export interface DeviceCustomProfile {
  /** Raw name of the device port, so we can still identify it. */
  raw_name: string;

  name?: string
  type?: DeviceType;
}

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

export const [webMidiDevices, setWebMidiDevices] = createSignal<ConnectedDeviceData[]>([]);

