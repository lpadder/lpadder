import type {
  NoteMessageEvent,
  ControlChangeMessageEvent
} from "webmidi";

import { useEffect, useState } from "react";

import { subscribeToInput, unsubscribeToInput } from "@/utils/webmidi";
import { useWebMidiStore } from "@/stores/webmidi";

import logger from "@/utils/logger";

// Components
import Select from "@/components/Select";
// import InputElement from "@/components/Input";

type MidiEvent =
  | { type: "noteon"; event: NoteMessageEvent }
  | { type: "noteoff"; event: NoteMessageEvent }
  | { type: "controlchange"; event: ControlChangeMessageEvent }

export default function UtilitiesMidiChecker () {
  const log = logger("UtilitiesMidiChecker");
  /** Debug. */ log.render();

  return (
    <div>
      <header
        className="mb-8 m-auto text-center max-w-xl"
      >
        <h1 className="font-medium text-2xl">
          MIDI Checker
        </h1>
        <p className="text-gray-400">
          This utility listens to all the events of
          the available inputs and show them there.
          You can also trigger events to the available outputs.
        </p>
      </header>

      <MidiOutputSender />
      <MidiInputChecker />
    </div>
  );
}

const MidiOutputSender = () => {
  const log = logger("MidiOutputSender");
  /** Debug. */ log.render();

  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null);
  const availableOutputs = useWebMidiStore(state => state.outputs);

  // const [message, setMessage] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);

  const handleSend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedOutputId) return;

    const output = availableOutputs[selectedOutputId];
    if (!output) return;

    // console.info("[midi-checker] Sending message", message, "to output:", output);
    // output.send(message);
  };

  return (
    <div className="max-w-xl mx-auto mb-8 p-6 bg-gray-900 shadow-lg rounded-lg bg-opacity-40">
      <h2 className="mb-4 text-xl text-gray-300">Send output to MIDI</h2>

      <div>
        <label htmlFor="midi-output-select" className="text-sm font-medium mb-1">
          MIDI Output
        </label>
        <Select
          name="midi-output-select"
          onChange={(evt) => {
            const value = evt.target.value;

            if (value === "none") setSelectedOutputId(null);
            else setSelectedOutputId(value);
          }}
          placeholder="Select an output"
        >
          <option value="none">None</option>
          {Object.keys(availableOutputs).map(output_id => (
            <option
              key={output_id}
              value={output_id}
            >
              {availableOutputs[output_id].name}
            </option>
          ))}
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
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

const MidiInputChecker = () => {
  const log = logger("MidiInputChecker");
  /** Debug. */ log.render();

  const webMidiEnabled = useWebMidiStore(state => state.isEnabled);
  const availableInputs = useWebMidiStore(state => state.inputs);

  const [midiEventsLimit/**, setMidiEventsLimit*/] = useState(20);
  const [midiEvents, setMidiEvents] = useState<MidiEvent[]>([]);

  /** Add an item to the midi events array. */
  const appendToMidiEvent = (midiEvent: MidiEvent) => setMidiEvents(events => {
    /** If we go more than the limit, remove last item. */
    if (events.length >= midiEventsLimit) {
      events.pop();
    }

    /** We add the event at the start of the array. */
    return [midiEvent, ...events];
  });

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

  useEffect(() => {
    log.effectGroup("Subscribe to listeners.");

    for (const [, input] of Object.entries(availableInputs)) {
      subscribeToInput(input, inputEventCallback);
      console.info("Subscribed to", input);
    }
    
    console.info("Done !");
    console.groupEnd();

    return () => {
      log.effectGroup("Unsubscribe to listeners.");
      
      for (const [, input] of Object.entries(availableInputs)) {
        unsubscribeToInput(input, inputEventCallback);
        console.info("Unsubscribed from", input);
      }
      
      console.info("Done !");
      console.groupEnd();
    };
  }, [availableInputs]);

  if (!webMidiEnabled) return(
    <div>
      <p>WebMidi is currently loading... Please wait !</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {midiEvents.map((event_info, event_index) => (
        <div
          className="p-4 bg-gray-900 rounded-lg cursor-pointer hover:bg-opacity-60"
          key={event_index}
        >
          <p>[{event_info.event.port.name}]: {event_info.type} ({event_info.type === "controlchange" ? event_info.event.controller.number : event_info.event.note.number}) on channel {event_info.event.message.channel}.</p>
        </div> 
      ))}
    </div>
  );
};