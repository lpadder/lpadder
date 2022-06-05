import type { Component } from "solid-js";

import type {
  NoteMessageEvent,
  ControlChangeMessageEvent
} from "webmidi";

import { Show, createSignal, For, onCleanup, createEffect } from "solid-js";
import {
  webMidiInformations,
  webMidiInputs,
  webMidiOutputs
} from "@/stores/webmidi";

// Components
import Select from "@/components/Select";
// import InputElement from "@/components/Input";

type MidiEvent =
  | { type: "noteon"; event: NoteMessageEvent }
  | { type: "noteoff"; event: NoteMessageEvent }
  | { type: "controlchange"; event: ControlChangeMessageEvent }

const MidiOutputSender = () => {
  const [selectedOutputId, setSelectedOutputId] = createSignal<string | null>(null);
  // const [message, setMessage] = createSignal<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);

  const handleSend = (e: Event) => {
    e.preventDefault();

    const output_id = selectedOutputId();
    if (!output_id) return;

    const output = webMidiOutputs()[output_id];
    if (!output) return;

    // console.info("[midi-checker] Sending message", message, "to output:", output);
    // output.send(message);
  };

  return (
    <div class="max-w-xl mx-auto mb-8 p-6 bg-gray-900 shadow-lg rounded-lg bg-opacity-40">
      <h2 class="mb-4 text-xl text-gray-300">Send output to MIDI</h2>

      <div>
        <label for="midi-output-select" class="text-sm font-medium mb-1">
          MIDI Output
        </label>
        <Select

          id="midi-output-select"
          onChange={(evt) => {
            const value = evt.currentTarget.value;

            if (value === "none") setSelectedOutputId(null);
            else setSelectedOutputId(value);
          }}
          
          title="Select an output"
        >
          <option value="none">None</option>

          <For each={Object.keys(webMidiOutputs())}>
            {output_id => (
              <option value={output_id}>
                {webMidiOutputs()[output_id].name}
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
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSend}
      >
        Send
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
  const inputEventCallback = (event: NoteMessageEvent | ControlChangeMessageEvent) => {
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
  };

  createEffect(() => {
    console.group("[midi-checker/mount] Subscribe to listeners.");
      
    for (const input_id of Object.keys(webMidiInputs())) {
      const input = webMidiInputs()[input_id];

      input.addListener("noteon", inputEventCallback);
      input.addListener("noteoff", inputEventCallback);
      input.addListener("controlchange", inputEventCallback);
      
      console.info("Subscribed to", input);
    }
      
    console.info("Done !");
    console.groupEnd();
    
    /** On cleanup, we unsubscribe from all the inputs. */
    onCleanup(() => {
      console.group("[midi-checker/cleanup] Unsubscribe to listeners.");
      
      for (const input_id of Object.keys(webMidiInputs())) {
        const input = webMidiInputs()[input_id];

        input.removeListener("noteon", inputEventCallback);
        input.removeListener("noteoff", inputEventCallback);
        input.removeListener("controlchange", inputEventCallback);
        
        console.info("Unsubscribed from", input);
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
              class="p-4 bg-gray-900 rounded-lg cursor-pointer hover:bg-opacity-60"
            >
              <p>[{event_info.event.port.name}]: {event_info.type} ({event_info.type === "controlchange" ? event_info.event.controller.number : event_info.event.note.number}) on channel {event_info.event.message.channel}.</p>
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
        <p class="text-gray-400">
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