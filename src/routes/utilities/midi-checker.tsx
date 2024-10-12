import type { Component } from "solid-js";

import type {
  MessageEvent,
  NoteMessageEvent,
  ControlChangeMessageEvent
} from "webmidi";

import {
  webMidiDevices,
  webMidiInformations
} from "@/stores/webmidi";

// Components
import Select from "@/components/Select";
// Import InputElement from "@/components/Input";

type MidiEvent =
  | { type: "noteon", event: NoteMessageEvent }
  | { type: "noteoff", event: NoteMessageEvent }
  | { type: "controlchange", event: ControlChangeMessageEvent }
  | { type: "sysex", event: MessageEvent }

const MidiOutputSender = () => {
  const [selectedDeviceIndex, setSelectedDeviceIndex] = createSignal<number | null>(null);

  const handleSysExSend = (e: Event) => {
    e.preventDefault();

    const deviceIndex = selectedDeviceIndex();
    const devices = webMidiDevices();

    if (deviceIndex === null) return;
    const output = devices[deviceIndex].output;

    const sysex = [0, 32, 41, 2, 14, 3, 3, 99, 255 >> 1, 255 >> 1, 255 >> 1];
    console.log(sysex);
    output.sendSysex([], sysex);
  };

  return (
    <div class="max-w-xl mx-auto mb-8 p-6 bg-slate-900 shadow-lg rounded-lg bg-opacity-40">
      <h2 class="mb-4 text-xl text-slate-300">Send output to MIDI</h2>

      <div>
        <label for="midi-output-select" class="text-sm font-medium mb-1">
          MIDI Output
        </label>
        <Select

          id="midi-output-select"
          onChange={(evt) => {
            const value = evt.currentTarget.value;

            if (value === "none") setSelectedDeviceIndex(null);
            else setSelectedDeviceIndex(parseInt(value));
          }}

          title="Select an output"
        >
          <option value="none">None</option>

          <For each={webMidiDevices().filter(device => device.enabled)}>
            {(device, deviceIndex) => (
              <option value={deviceIndex()}>
                {device.name}
              </option>
            )}
          </For>
        </Select>
      </div>

      {/* <div className="flex gap-2">
        {[...Array(8).keys()].map(byte => (
          <InputElement
            key={byte}
            type="number"
            labelName={`Byte ${byte + 1}`}
            value={(message[byte] ?? 0).toString()}
            onChange={(evt) => {
              const value = parseInt(evt.target.value);
              if (Number.isNaN(value)) return;

              const newMessage = [...message];
              newMessage[byte] = value;

              setMessage(newMessage);
            }}
            placeholder=""

            min={0}
            max={255}
          />
        ))}
      </div> */}

      <button
        class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSysExSend}
      >
        Send SysEx
      </button>
    </div>
  );
};

const MidiInputChecker = () => {
  const [midiEventsLimit/**, setMidiEventsLimit*/] = createSignal(20);
  const [midiEvents, setMidiEvents] = createSignal<MidiEvent[]>([]);

  /** Add an item to the midi events array. */
  const appendToMidiEvent = (midiEvent: MidiEvent) => setMidiEvents(events => {
    /** If we go more than the limit, remove last item. */
    if (events.length >= midiEventsLimit()) {
      events.pop();
    }

    /** We add the event at the start of the array. */
    return [midiEvent, ...events];
  });

  /**
   * Callback of a listener on input.
   * It adds the value from the input to the `midiEvents` array.
   */
  const inputEventCallback = (event: NoteMessageEvent | ControlChangeMessageEvent | MessageEvent) => {
    if (event.type === "noteon" || event.type === "noteoff") {
      return appendToMidiEvent({
        type: event.type,
        event: event as NoteMessageEvent
      });
    }

    if (event.type === "controlchange") {
      return appendToMidiEvent({
        type: event.type,
        event: event as ControlChangeMessageEvent
      });
    }

    if (event.type === "sysex") {
      return appendToMidiEvent({
        type: event.type,
        event: event as MessageEvent
      });
    }
  };

  createEffect(() => {
    console.group("[midi-checker/mount] Subscribe to listeners.");

    for (const { input, name } of webMidiDevices().filter(device => device.enabled)) {
      input.addListener("noteon", inputEventCallback);
      input.addListener("noteoff", inputEventCallback);
      input.addListener("controlchange", inputEventCallback);
      input.addListener("sysex", inputEventCallback);

      console.info("Subscribed to", name);
    }

    console.info("Done !");
    console.groupEnd();

    /** On cleanup, we unsubscribe from all the inputs. */
    onCleanup(() => {
      console.group("[midi-checker/cleanup] Unsubscribe to listeners.");

      for (const { input, name } of webMidiDevices().filter(device => device.enabled)) {
        input.removeListener("noteon", inputEventCallback);
        input.removeListener("noteoff", inputEventCallback);
        input.removeListener("controlchange", inputEventCallback);
        input.removeListener("sysex", inputEventCallback);

        console.info("Unsubscribed from", name);
      }

      console.info("Done !");
      console.groupEnd();
    });
  });


  return (
    <Show when={webMidiInformations.isEnabled} fallback={<p>WebMidi is currently loading... Please wait !</p>}>
      <div class="flex flex-col gap-4">
        <For each={midiEvents()}>
          {event_info => (
            <div
              class="p-4 bg-slate-900 rounded-lg cursor-pointer hover:bg-opacity-60"
            >
              <h4>[{event_info.event.port.name}]</h4>
              <p>Channel {event_info.event.message.channel ?? "UNKNOWN"}</p>

              <Switch>
                <Match when={event_info.type === "controlchange" && event_info}>
                  {({ event }) => (
                    <span>CC: {event.controller.number}</span>
                  )}
                </Match>
                <Match when={event_info.type === "sysex" && event_info}>
                  {({ event }) => (
                    <span>SysEx: {event.message.data.toString()}</span>
                  )}
                </Match>
                <Match when={event_info.type === "noteon" && event_info}>
                  {({ event }) => (
                    <span>NoteOn: {event.note.number}</span>
                  )}
                </Match>
                <Match when={event_info.type === "noteoff" && event_info}>
                  {({ event }) => (
                    <span>NoteOff: {event.note.number}</span>
                  )}
                </Match>
              </Switch>
            </div>
          )}
        </For>
      </div>
    </Show>
  );
};

const UtilitiesMidiChecker: Component = () => {
  return (
    <div>
      <header
        class="mb-8 m-auto text-center max-w-xl"
      >
        <h1 class="font-medium text-2xl">
          MIDI Checker
        </h1>
        <p class="text-slate-400">
          This utility listens to all the events of
          the available inputs and show them there.
          You can also trigger events to the available outputs.
        </p>
      </header>

      <MidiOutputSender />
      <MidiInputChecker />
    </div>
  );
};

export default UtilitiesMidiChecker;
