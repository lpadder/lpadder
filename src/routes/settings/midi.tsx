import type { Component } from "solid-js";

import {
  webMidiDevices,
  setWebMidiDevices,

  deviceCustomProfiles,
  setDeviceCustomProfiles
} from "@/stores/webmidi";

import { devicesConfiguration, DeviceType } from "@/utils/devices";

import Input from "@/components/Input";
import Select from "@/components/Select";

const SettingsMidi: Component = () => {

  return (
    <>
      <Title>lpadder - settings: MIDI</Title>
      <h2>MIDI devices profiles</h2>
      <p>Here, you can find the your saved MIDI devices profiles.</p>

      <div class="flex flex-col gap-2 py-4">
        <Index each={webMidiDevices()}>
          {(device, deviceIndex) => (
            <div
              class={`
                flex flex-col gap-2
                py-4 px-6 rounded-md
                
                ${device().enabled ? "opacity-80" : "opacity-40"}
                focus-within:opacity-100
                hover:opacity-100
                
                transition-opacity
                bg-opacity-20
              `}
              classList={{
                "bg-fuchsia-600": !device().enabled,
                "bg-sky-600": device().enabled
              }}
            >
              <Input
                label="Name"
                tip={
                  (device().name !== device().raw_name)
                    ? `Was ${device().raw_name}` : undefined
                }
                autocomplete="off"
                value={device().name}
                onInput={(evt) => {
                  const devices = webMidiDevices();
                  devices[deviceIndex] = {
                    ...device(),
                    name: evt.currentTarget.value
                  };

                  const profiles = deviceCustomProfiles();
                  const profilIndex = profiles.findIndex((profile) => profile.raw_name === device().raw_name);
                  profiles[profilIndex] = {
                    ...profiles[profilIndex],
                    name: evt.currentTarget.value
                  };

                  setWebMidiDevices([...devices]);
                  setDeviceCustomProfiles(profiles);
                }}
              />

              <Select
                value={device().type || "none"}
                onChange={(evt) => {
                  const type = evt.currentTarget.value === "none"
                    ? undefined
                    : evt.currentTarget.value as DeviceType;

                  const devices = webMidiDevices();
                  devices[deviceIndex] = {
                    ...device(),
                    type
                  };

                  const profiles = deviceCustomProfiles();
                  const profilIndex = profiles.findIndex((profile) => profile.raw_name === device().raw_name);
                  profiles[profilIndex] = {
                    ...profiles[profilIndex],
                    type
                  };

                  setWebMidiDevices([...devices]);
                  setDeviceCustomProfiles(profiles);
                }}
              >
                <option value="none">Unknown</option>

                <For each={Object.keys(devicesConfiguration) as DeviceType[]}>
                  {(device_type) => (
                    <option value={device_type}>{devicesConfiguration[device_type].name}</option>
                  )}
                </For>
              </Select>

              <label class="flex items-center gap-2">
                <input
                  class="w-4 h-4"
                  type="checkbox"
                  checked={device().enabled}
                  onChange={(evt) => {
                    const devices = webMidiDevices();
                    devices[deviceIndex] = {
                      ...device(),
                      enabled: evt.currentTarget.checked
                    };

                    const profiles = deviceCustomProfiles();
                    const profilIndex = profiles.findIndex((profile) => profile.raw_name === device().raw_name);
                    profiles[profilIndex] = {
                      ...profiles[profilIndex],
                      enabled: evt.currentTarget.checked
                    };

                    setWebMidiDevices([...devices]);
                    setDeviceCustomProfiles(profiles);
                  }}
                />
                Enabled
              </label>
            </div>
          )}
        </Index>
      </div>
    </>
  );
};

export default SettingsMidi;
