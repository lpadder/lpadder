import type {
  Input, Output,
  NoteMessageEvent
} from "webmidi";

import { Fragment, useEffect, useState } from "react";
import { WebMidi } from "webmidi";

import create from "zustand";

// Components
import Select from "@/components/Select";

type MidiEvent = (
  | { type: "noteon"; event: NoteMessageEvent }
  | { type: "noteoff"; event: NoteMessageEvent }
);

interface MidiEventsStore {
  midiEvents: MidiEvent[];
  appendMidiEvent: (event: MidiEvent) => void;
  clearMidiEvents: () => void;

  /** Max events for `midiEvents`. */
  limit: number;
  setLimit: (limit: number) => void;
}

const useMidiEventsStore = create<MidiEventsStore>((set, get) => ({
  midiEvents: [],
  clearMidiEvents: () => set(() => ({ midiEvents: [] })),
  appendMidiEvent: (event: MidiEvent) => {
    const { limit, midiEvents: events } = get();

    if (events.length >= limit) {
      events.shift();
    }

    set(() => ({
      midiEvents: [...events, event]
    }));
  },

  limit: 20,
  setLimit: (limit: number) => set(() => ({ limit })),
}));

export default function UtilitiesMidiChecker () {
  const [webMidiEnabled, setWebMidiEnabled] = useState(WebMidi.enabled);

  const [availableInputs, setAvailableInputs] = useState<Input[]>([]);
  const [availableOutputs, setAvailableOutputs] = useState<Output[]>([]);

  const midiEvents = useMidiEventsStore(state => state.midiEvents);

  /** Function to refresh 'availableDevices' state */
  const refreshAvailableDevices = () => {
    console.group("[refreshAvailableDevices] Refresh states.");
    
    // Clean the current states.
    setAvailableInputs([]);
    setAvailableOutputs([]);

    // Get the devices.
    const { inputs, outputs } = WebMidi;

    console.info("Inputs", inputs);    
    setAvailableInputs(inputs);

    console.info("Add listeners to inputs...");
    inputs.forEach(input => subscribeToMidiEvents(input));
    console.info("Done !");

    console.info("Outputs", outputs);
    setAvailableOutputs(outputs);

    console.groupEnd();
  };

  useEffect(() => {
    console.group("[midi-checker][useEffect] Enable.");

    const loadWebMidi = async () => {
      console.info("-> Starting WebMidi...");

      return WebMidi
        .enable()
        .then (() => {
          console.info("<- Successfully enabled !");
          console.groupEnd();

          // Update WebMidi state.
          setWebMidiEnabled(true);
          refreshAvailableDevices();          
        })
        .catch (err => {
          console.error("<- An error was thrown.", err);
          console.groupEnd();

          alert("An error happenned, check console.");
        });
    };

    const disableWebMidi = async () => {
      console.info("-> Disabling WebMidi...");

      return WebMidi
        .disable()
        .then (() => {
          console.info("<- Successfully disabled !");
          console.groupEnd();

          // Update WebMidi state.
          setWebMidiEnabled(false);
          setAvailableInputs([]);
          setAvailableOutputs([]);
        })
        .catch (err => {
          console.error("<- An error was thrown.", err);
          console.groupEnd();

          alert("An error happenned, check console.");
        });
    };

    if (!webMidiEnabled) loadWebMidi();
    else {
      console.info("<- WebMidi is already enabled ! Reloading it...");
      disableWebMidi().then(() => loadWebMidi());
    }

    return () => {
      console.group("[midi-checker][useEffect] Clean-up.");
      disableWebMidi();
    };
  }, []);

  const subscribeToMidiEvents = (input: Input) => {
    input.addListener("noteon", (e) => {
      console.info(`[noteon][${input.name}][${input.id}]`, e);

      useMidiEventsStore.getState().appendMidiEvent({
        type: "noteon",
        event: e
      });
    });

    input.addListener("noteoff", (e) => {
      console.info(`[noteoff][${input.name}][${input.id}]`, e);

      useMidiEventsStore.getState().appendMidiEvent({
        type: "noteoff",
        event: e
      });
    });

    console.info(`Subscribed to MIDI events of input "${input.name}, ${input.manufacturer}, ${input.id}".`);
  };

  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null);

  if (!webMidiEnabled) return (
    <div>
      <p>WebMidi is currently loading...</p>
    </div>
  );

  return (
    <div>
      <header
        className="mb-4 m-auto text-center max-w-xl"
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

      <Fragment>
        <Select
          onChange={(evt) => {
            const value = evt.target.value;

            if (value === "none") setSelectedOutputId(null);
            else setSelectedOutputId(value);
          }}
          placeholder="Select an output"
        >
          {availableOutputs.map(input => (
            <option
              key={input.id}
              value={input.id}
            >
              {input.name}
            </option>
          ))}
        </Select>
      </Fragment>

      <h2>Send MIDI</h2>

      <div>
        {midiEvents.map(event_info => (
          <div key={`${event_info.type}-${event_info.event.note.number}-${event_info.event.timestamp}`}>
            <p>{event_info.type} ; Channel: {event_info.event.message.channel}</p>
          </div> 
        ))}
      </div>
    </div>
  );
}
