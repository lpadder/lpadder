import type { Component, JSX } from "solid-js";
import type { NoteMessageEvent } from "webmidi";
import type { ConnectedDeviceData } from "@/stores/webmidi";
import type { DeviceType } from "@/utils/devices";

import { devicesConfiguration } from "@/utils/devices";

export function getPadElementId (padId: number, launchpadId = 0) {
  const elementId = `launchpad-${launchpadId}-pad-${padId}`;
  return elementId;
}

export type PadEventFunctionProps = (
  padId: number
) => void;

export type ContextEventFunctionProps = (
  padId: number,
  event: Parameters<JSX.EventHandler<HTMLDivElement, MouseEvent>>[number]
) => void;

/**
 * We create a new launchpad with the given layout.
 * 'launchpadId' is used when using multiples launchpad
 * on the same page. We will use it in the HTML "id" to
 * access the pad later.
 */
const Device: Component<{
  ref?: HTMLDivElement;

  /** The device this component should look if no real device is linked to it. */
  defaultDeviceType: DeviceType;

  onPadDown: PadEventFunctionProps;
  onPadUp: PadEventFunctionProps;
  /** Optional custom behaviour on right click. */
  onContextMenu?: ContextEventFunctionProps;

  /** Optional real device linked with the virtual component. */
  linkedDevice?: ConnectedDeviceData;

}> = (props) => {
  /** Layout to use depending of the type of device we use. */
  const layout = () =>
    devicesConfiguration[props.linkedDevice?.type
      ? props.linkedDevice.type
      : props.defaultDeviceType
    ].layout_to_use;

  const noteOnHandler = (note: number) => {
    props.onPadDown(note);
  };

  const noteOffHandler = (note: number) => {
    props.onPadUp(note);
  };

  /** If a device is linked, automatically listen to its inputs. */
  createEffect(() => {
    if (!props.linkedDevice) return;
    console.info("[device]: linking to device", props.linkedDevice.name);

    const deviceNoteOnHandler = (evt: NoteMessageEvent) => {
      const note = evt.note.number;
      noteOnHandler(note);
    };

    const deviceNoteOffHandler = (evt: NoteMessageEvent) => {
      const note = evt.note.number;
      noteOffHandler(note);
    };

    const device = props.linkedDevice;
    device.input.addListener("noteon", deviceNoteOnHandler);
    device.input.addListener("noteoff", deviceNoteOffHandler);

    onCleanup(() => {
      if (!props.linkedDevice) return;
      console.info("[device]: unlinking to device", props.linkedDevice.name);

      device.input.removeListener("noteon", deviceNoteOnHandler);
      device.input.removeListener("noteoff", deviceNoteOffHandler);
    });
  });

  return (
    <div
      ref={props.ref}
      class="flex flex-col gap-1"
    >
      <For each={layout()}>
        {rows => (
          <div class="flex flex-row gap-1">
            <For each={rows}>
              {(padId) => (
                <div
                  data-note={padId}

                  onContextMenu={event => {
                    event.preventDefault();

                    // Execute the custom behaviour if it exists.
                    if (!props.onContextMenu) return;
                    return props.onContextMenu(padId, event);
                  }}

                  onTouchStart={down_event => {
                    /**
                     * By stopping propagation, we suppress
                     * the `onMouseDown` event.
                     */
                    down_event.stopPropagation();

                    // We save the target pad HTML element.
                    // Const pad = down_event.currentTarget;

                    const handleTouchEnd = (up_event: TouchEvent) => {
                      up_event.preventDefault();

                      noteOffHandler(padId);
                      document.removeEventListener("touchend", handleTouchEnd);
                    };

                    noteOnHandler(padId);
                    document.addEventListener("touchend", handleTouchEnd);
                  }}

                  onMouseDown={down_event => {
                    if (down_event.button === 2) return;

                    // We save the target pad HTML element.
                    // Const pad = down_event.currentTarget;

                    const handleMouseUp = (up_event: MouseEvent) => {
                      if (up_event.button === 2) return;

                      noteOffHandler(padId);
                      document.removeEventListener("mouseup", handleMouseUp);
                    };

                    noteOnHandler(padId);
                    document.addEventListener("mouseup", handleMouseUp);
                  }}

                  class="w-full bg-gray-400 rounded-sm select-none aspect-square"
                />
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
};

export default Device;
