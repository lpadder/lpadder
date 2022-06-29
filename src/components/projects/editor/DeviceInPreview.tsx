import type { ParentComponent } from "solid-js";

import Launchpad from "@/components/Launchpad";

import { currentProjectStore } from "@/stores/current_project";

const DeviceInPreview: ParentComponent<{
  x: number,
  y: number
}> = (props) => {
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

  const onPadDown = () => {
    console.log("down");
  };

  const onPadUp = () => {
    console.log("up");
  };

  return (
    <div style={{
      left: canvasX0() + props.x + "px", top: canvasY0() + props.y + "px"
    }} class="bg-gray-600 h-32 w-32 absolute rounded p-2">
      <Launchpad onPadUp={onPadUp} onPadDown={onPadDown}  />
    </div>
  );
};

export default DeviceInPreview;
