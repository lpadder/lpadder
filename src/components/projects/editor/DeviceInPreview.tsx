import type { ParentComponent } from "solid-js";
import type { ProjectMetadata } from "@/types/Project";

import Device from "@/components/Device";

import { devicesConfiguration } from "@/utils/devices";

import { currentProjectStore } from "@/stores/current_project";
import { webMidiDevices } from "@/stores/webmidi";

const DeviceInPreview: ParentComponent<ProjectMetadata["devices"][number]> = (device) => {
  let device_ref: HTMLDivElement | undefined;

  /**
   * This determines the position of X = 0
   * depending on the width of the canvas.
   */
  const canvasX0 = () => (currentProjectStore.metadata?.canvasWidth || 0) / 2;

  /**
   * This determines the position of Y = 0
   * depending on the height of the canvas.
   */
  const canvasY0 = () => (currentProjectStore.metadata?.canvasHeight || 0) / 2;

  /** Check if the linked device is connected or not. */
  const linkedDevice = () => webMidiDevices().find(
    current_device => current_device.raw_name === device.device_linked
  );

  const deviceType = () => linkedDevice()?.type || device.type;

  const onPadDown = (note: number) => {
    if (!device_ref) return;
    const device = linkedDevice();

    const device_element = device_ref.querySelector(`[data-note="${note}"]`) as HTMLDivElement;
    if (!device_element) return;

    if (device) {
      const led = { note, color: [255, 255, 255] };
      const sysex = devicesConfiguration[deviceType()].rgb_sysex([led]);
      device.output.sendSysex([], sysex);
    }

    device_element.style.backgroundColor = "rgb(255, 255, 255)";
  };

  const onPadUp = (note: number) => {
    if (!device_ref) return;
    const device = linkedDevice();

    const device_element = device_ref.querySelector(`[data-note="${note}"]`) as HTMLDivElement;
    if (!device_element) return;

    if (device) {
      const led = { note, color: [0, 0, 0] };
      const sysex = devicesConfiguration[deviceType()].rgb_sysex([led]);
      device.output.sendSysex([], sysex);
    }

    device_element.style.backgroundColor = "rgb(148, 163, 184)";
  };

  return (
    <div style={{
      left: canvasX0() + device.canvasX + "px", top: canvasY0() + device.canvasY + "px",
      height: "200px", width: "200px", transform: `scale(${device.canvasScale})`
    }} class="bg-slate-900 absolute rounded p-2">
      <Device
        ref={device_ref}
        linkedDevice={linkedDevice()}
        defaultDeviceType={device.type}
        onPadUp={onPadUp}
        onPadDown={onPadDown}
      />
    </div>
  );
};

export default DeviceInPreview;
