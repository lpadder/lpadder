import type { Component } from "solid-js";

import {
  webMidiDevices,
  setWebMidiDevices,

  deviceCustomProfiles,
  setDeviceCustomProfiles
} from "@/stores/webmidi";

import Input from "@/components/Input";

const SettingsMidi: Component = () => {
  return (
    <>
      <Title>lpadder - settings: MIDI</Title>
      <h2>MIDI devices profiles</h2>
      <p>Here, you can find the your saved MIDI devices profiles.</p>

      <div>
        <Index each={webMidiDevices()}>
          {(device, deviceIndex) => (
            <div>
              <h4>{
                device().name === device().raw_name
                  ? device().name
                  : `${device().name} (${device().raw_name})`
              }</h4>

              <Input
                autocomplete="off"
                value={device().name}
                onChange={(evt) => {
                  const devices = webMidiDevices();
                  devices[deviceIndex] = {
                    ...device(),
                    name: evt.currentTarget.value
                  };

                  const profiles = deviceCustomProfiles();
                  const profilIndex = profiles.findIndex(profile => profile.raw_name === device().raw_name);
                  profiles[profilIndex] = {
                    ...profiles[profilIndex],
                    name: evt.currentTarget.value
                  };

                  setWebMidiDevices([...devices]);
                  setDeviceCustomProfiles(profiles);
                }}
              />
            </div>
          )}
        </Index>
      </div>
    </>
  );
};

export default SettingsMidi;
