import type { Component } from "solid-js";
import type { ControlChangeMessageEvent, NoteMessageEvent } from "webmidi";
import type { ConnectedDeviceData } from "@/stores/webmidi";
import type { DeviceType } from "@/utils/devices";
import type { DeviceComponentProps } from "@/components/devices";

import { SwitchDevice } from "@/components/devices";
import { convertNoteLayout } from "@/utils/devices";

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

  const deviceType = () => props.linkedDevice?.type || props.defaultDeviceType;

  /**
   * We need to process note to use the proper layout.
   * ex: Launchpad PRO uses programmer but CFW uses Drum Rack layout in events.
   */
  const processNote = (note: number) => {
    const type = deviceType();
    if (type === "launchpad_pro_mk2_cfw" || type === "launchpad_pro_mk2_cfy") {
      const noteConvertion = convertNoteLayout(note, "drum_rack", "programmer");
      if (!noteConvertion.success) return note;
      return noteConvertion.result;
    }

    return note;
  };

  /** If a device is linked, automatically listen to its inputs. */
  createEffect(() => {
    if (!props.linkedDevice) return;
    console.info("[device]: linking to device", props.linkedDevice.name);

    const deviceNoteOnHandler = (evt: NoteMessageEvent) => {
      const note = processNote(evt.note.number);
      noteOnHandler(note);
    };

    const deviceNoteOffHandler = (evt: NoteMessageEvent) => {
      const note = processNote(evt.note.number);
      noteOffHandler(note);
    };

    /** We also listen to `controlchange` for the Launchpad Pro "Live" mode. */
    const deviceControlChangeHandler = (evt: ControlChangeMessageEvent) => {
      /** Event: noteoff */
      if (evt.rawValue === 0) {
        const note = processNote(evt.controller.number);
        noteOffHandler(note);
      }
      /** Event: noteon */
      else if (evt.rawValue === 127) {
        const note = processNote(evt.controller.number);
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
      type={deviceType()}
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
