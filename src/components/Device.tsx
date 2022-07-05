import type { Component } from "solid-js";
import type { ControlChangeMessageEvent, NoteMessageEvent } from "webmidi";
import type { ConnectedDeviceData } from "@/stores/webmidi";
import type { DeviceType } from "@/utils/devices";
import type { DeviceComponentProps } from "@/components/devices";

import { SwitchDevice } from "@/components/devices";

export function getPadElementId (padId: number, launchpadId = 0) {
  const elementId = `launchpad-${launchpadId}-pad-${padId}`;
  return elementId;
}

/**
 * We create a new device component which its layout
 * is based the the `linkedDevice`'s type or `defaultDeviceType`
 * when the device isn't linked.
 *
 * Three events are can be handled such as `onPadDown` and `onPadUp`.
 * These two events reacts on the virtual device but also on the real one.
 *
 * A `ref` can be passed so we can access the device HTML element
 * to easily update its elements (with a querySelector on `[data-note]`).
 */
const Device: Component<{
  ref?: HTMLDivElement;

  /** The device this component should look if no real device is linked to it. */
  defaultDeviceType: DeviceType;
  /** Optional real device linked with the virtual component. */
  linkedDevice?: ConnectedDeviceData;

  onPadDown: DeviceComponentProps["onPadDown"];
  onPadUp: DeviceComponentProps["onPadUp"];
  onContextMenu?: DeviceComponentProps["onContext"];
}> = (props) => {

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

    /** We also listen to `controlchange` for the Launchpad Pro "Live" mode. */
    const deviceControlChangeHandler = (evt: ControlChangeMessageEvent) => {
      /** Event: noteoff */
      if (evt.rawValue === 0) {
        const note = evt.controller.number;
        noteOffHandler(note);
      }
      /** Event: noteon */
      else if (evt.rawValue === 127) {
        const note = evt.controller.number;
        noteOnHandler(note);
      }
    };

    const device = props.linkedDevice;
    device.input.addListener("noteon", deviceNoteOnHandler);
    device.input.addListener("noteoff", deviceNoteOffHandler);
    device.input.addListener("controlchange", deviceControlChangeHandler);

    onCleanup(() => {
      if (!props.linkedDevice) return;
      console.info("[device]: unlinking to device", props.linkedDevice.name);

      device.input.removeListener("noteon", deviceNoteOnHandler);
      device.input.removeListener("noteoff", deviceNoteOffHandler);
      device.input.removeListener("controlchange", deviceControlChangeHandler);
    });
  });

  return (
    <SwitchDevice
      ref={props.ref}
      type={props.linkedDevice?.type || props.defaultDeviceType}
      onPadDown={noteOnHandler}
      onPadUp={noteOffHandler}
      onContext={(note, event) => {
        if (!props.onContextMenu) return;
        props.onContextMenu(note, event);
      }}
    />
  );
};

export default Device;
