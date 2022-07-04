import type { ConnectedDeviceData } from "@/stores/webmidi";

import { guessDeviceType, devicesConfiguration } from "@/utils/devices";
import { log } from "@/utils/logger";
import { WebMidi } from "webmidi";

import {
  webMidiDevices,
  setWebMidiDevices,
  setWebMidiInformations,
  deviceCustomProfiles,
  setDeviceCustomProfiles
} from "@/stores/webmidi";

export const removeInOutFromName = (name: string) => {
  const regexp = /(IN)|(OUT)/gi;
  name.replace(regexp, "");
  return name;
};

/**
 * Check if a device is black listed.
 *
 * Why would a device be black listed ?
 * To prevent multiple entries of the exact same device in the store.
 *
 * For example, on macOS with a Launchpad Pro, you have 3 entries
 * => Launchpad Pro Live Port (the one we need)
 * => Launchpad Pro Standalone Port (also works but breaks everything on sysex initialization)
 * => Launchpad Pro MIDI Port (doesn't work)
 */
const isDeviceBlackListed = (name: string) => {
  /** With the CFW, there's no "Live Port", only "Standalone Port" is what we're asking. */
  if (name.toLowerCase() === "launchpad open standalone port") return false;

  const regexp = /(MIDI Port)|(Standalone Port)/gi;
  return regexp.test(name);
};

/**
 * This checks for devices and refresh the `webMidiDevices` signal.
 * @param isNewDevices - When `true`, will check for new devices.
 */
const checkWebMidiDevices = async (isNewDevices = true) => {
  console.info("[webmidi]: checking devices...");

  const devices = webMidiDevices();
  const profiles = deviceCustomProfiles();

  /** Check for connected devices. */
  if (isNewDevices) {
    for (const output of WebMidi.outputs) {
      // Find the input to pair with the output.
      const input = WebMidi.inputs.find(
        input => removeInOutFromName(input.name) === removeInOutFromName(output.name)
      );

      if (!input) return;

      const device_raw_name = removeInOutFromName(output.name);
      let device_name = device_raw_name;

      /** We don't put blacklisted devices in the store. */
      if (isDeviceBlackListed(device_name)) continue;

      /**
       * Whether the device already in the store or not.
       * When the device is already in the store, skip to the next one.
       */
      const alreadyInStore = devices.find(device => device.raw_name === device_raw_name);
      if (alreadyInStore) continue;

      // When new devices are connected, give them some time to boot before sending version query.
      await new Promise<void>((res) => setTimeout(() => res(), 500));

      // Guess the type of the device.
      const type = await guessDeviceType(output, input);
      const device_guessed_type = type;
      let device_type = device_guessed_type;

      const device_profile = profiles.find(profile => profile.raw_name === device_raw_name);
      if (device_profile) {
        log("profile", "found the profile for", device_raw_name);
        if (device_profile.name) device_name = device_profile.name;
        if (device_profile.type) device_type = device_profile.type;
      }

      // Send the initialization sysex to devices for instant setup.
      if (device_type && devicesConfiguration[device_type]) {
        const { initialization_sysex } = devicesConfiguration[device_type];
        for (const messageToSend of initialization_sysex) {
          setTimeout(() => {
            output.sendSysex([], messageToSend);
            console.info(`[webmidi/init]: sent sysex message to ${device_name} (${device_type})`, messageToSend);
          }, 2000);
        }
      }

      const device: ConnectedDeviceData = {
        guessed_type: device_guessed_type,
        type: device_type,

        raw_name: device_raw_name,
        name: device_name,

        input, output
      };

      /**
       * If the device wasn't saved in the profiles,
       * we save it for the next time it loads.
       */
      if (!device_profile) {
        console.info(`[webmidi]: saving ${device.name} to the profile...`);
        profiles.push({
          raw_name: device.raw_name,
          name: device.name,
          type: device.type
        });

        setDeviceCustomProfiles(profiles);
      }

      console.info(`[webmidi]: adding ${device.name} to the store...`);
      setWebMidiDevices(prev => [...prev, device]);
    }
  }
  /** Check for disconnected devices. */
  else {
    const filteredDevices = [...devices].filter(device => {
      const isStillConnected = WebMidi.outputs.find(
        output => output.id === device.output.id)
      && WebMidi.inputs.find(
        input => input.id === device.input.id
      );

      if (!isStillConnected)
        console.info(`[webmidi]: removing ${device.name} from the store...`);
      return isStillConnected;
    });

    setWebMidiDevices([...filteredDevices]);
  }
};

/**
 * Should be executed when the app is mounted, see `src/main.tsx`.
 * Returns a `Promise<boolean>`, so if we can't setup an instance,
 * we restrict some features that requires webmidi.
 *
 * This enables WebMidi but also stores the devices profiles and
 * checks for already connected devices.
 */
export const enableAndSetup = async () => {
  try {
    const midi = await WebMidi.enable({ sysex: true });
    console.info("[webmidi]: successfully enabled");

    // Refresh the devices store with already connected devices.
    checkWebMidiDevices();

    let connect_event_timeout: NodeJS.Timeout | undefined;
    midi.addListener("connected", () => {
      clearTimeout(connect_event_timeout);

      // Check the devices only after all the devices have been connected.
      connect_event_timeout = setTimeout(checkWebMidiDevices, 100);
    });

    let disconnect_event_timeout: NodeJS.Timeout | undefined;
    midi.addListener("disconnected", () => {
      clearTimeout(disconnect_event_timeout);

      // Check the devices only after all the devices have been disconnected.
      disconnect_event_timeout = setTimeout(() => checkWebMidiDevices(false), 100);
    });

    setWebMidiInformations({ isEnabled: true, wasRequested: true });
    return true;
  }
  catch (error) {
    console.error("[webmidi]:", error);
    setWebMidiInformations({ isEnabled: false, wasRequested: true });
    return false;
  }
};
