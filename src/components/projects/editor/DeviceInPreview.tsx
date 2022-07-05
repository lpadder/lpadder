import type { ParentComponent } from "solid-js";
import type { ProjectMetadata } from "@/types/Project";
import type { PadEventFunctionProps } from "@/components/Device";

import Device from "@/components/Device";

import { currentProjectStore } from "@/stores/current_project";
import { webMidiDevices } from "@/stores/webmidi";

const DeviceInPreview: ParentComponent<ProjectMetadata["devices"][number]> = (device) => {
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

  const onPadDown: PadEventFunctionProps = (note) => {
    console.log("down", note);
  };

  const onPadUp: PadEventFunctionProps = (note) => {
    console.log("up", note);
  };

  return (
    <div style={{
      left: canvasX0() + device.canvasX + "px", top: canvasY0() + device.canvasY + "px",
      height: device.canvasSize + "px", width: device.canvasSize + "px"
    }} class="bg-gray-600 absolute rounded p-2">
      <Device linkedDevice={linkedDevice()} defaultDeviceType={device.type} onPadUp={onPadUp} onPadDown={onPadDown}  />
    </div>
  );
};

export default DeviceInPreview;
