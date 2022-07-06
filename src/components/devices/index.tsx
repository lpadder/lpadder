import type { Component, JSX } from "solid-js";
import type { DeviceType } from "@/utils/devices";

export interface DeviceComponentProps {
  ref?: HTMLDivElement,
  onPadDown: (note: number) => unknown,
  onPadUp: (note: number) => unknown,
  onContext?: (
    note: number,
    event: Parameters<JSX.EventHandler<HTMLButtonElement, MouseEvent>>[number]
  ) => unknown
}

export type DeviceComponent = Component<DeviceComponentProps>;

export const DeviceButton: Component<{
  ref?: HTMLDivElement,
  id: number,
  class?: string,
  context?: DeviceComponentProps["onContext"],
  down: DeviceComponentProps["onPadDown"],
  up: DeviceComponentProps["onPadUp"]
}> = (props) => (
  <button
    class={props.class}
    data-note={props.id}

    onContextMenu={event => {
      event.preventDefault();

      // Execute the custom behaviour if it exists.
      if (!props.context) return;
      return props.context(props.id, event);
    }}

    onTouchStart={down_event => {
      /** By stopping propagation, we prevent the `onMouseDown` event. */
      down_event.stopPropagation();

      const handleTouchEnd = (up_event: TouchEvent) => {
        up_event.preventDefault();

        props.up(props.id);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      props.down(props.id);
      document.addEventListener("touchend", handleTouchEnd);
    }}

    onMouseDown={down_event => {
      if (down_event.button === 2) return;

      const handleMouseUp = (up_event: MouseEvent) => {
        if (up_event.button === 2) return;

        props.up(props.id);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      props.down(props.id);
      document.addEventListener("mouseup", handleMouseUp);
    }}
  />
);

// Devices
import LaunchpadProMK2 from "@/components/devices/LaunchpadProMK2";
import LaunchpadX from "@/components/devices/LaunchpadX";

export const SwitchDevice: Component<DeviceComponentProps & { type: DeviceType }> = (props) => {
  return (
    <Switch>
      <Match when={
        props.type === "launchpad_pro_mk2"
        || props.type === "launchpad_pro_mk2_cfw"
        || props.type === "launchpad_pro_mk2_cfy"
      }>
        <LaunchpadProMK2 {...props} />
      </Match>
      <Match when={props.type === "launchpad_x"}>
        <LaunchpadX {...props} />
      </Match>
    </Switch>
  );
};

