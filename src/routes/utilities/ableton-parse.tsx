import type { JSX, Component } from "solid-js";
import type { ParsedAbletonData } from "@/types/AbletonData";

import type {
  MidiDeviceSampleData,
  MidiDeviceDrumRackData,
  MidiDeviceInstrumentRackData,
  MidiTrackData
} from "@/types/AbletonData";

import { createStore } from "solid-js/store";

import FileInput from "@/components/FileInput";
import Launchpad from "@/components/Device";

import {
  readAbletonFile,
  parseAbletonData
} from "@/utils/parseAbletonData";

import { convertNoteLayout } from "@/utils/devices";

const AbletonParsedResults: Component<{
  abletonData: ParsedAbletonData
}> = (props) => {
  return (
    <div>
      <h2 class="text-center font-medium text-2xl">
        MIDI tracks
      </h2>

      <div class="flex flex-col gap-4 my-6">
        <For each={props.abletonData.tracksData}>
          {track => (track.type === "midi") && (
            <div
              class="p-4 bg-gray-900 rounded-lg"
            >
              <div class="mb-4">
                <h4 class="font-medium text-lg text-gray-300">{track.name}</h4>
                <p class="text-gray-400">This track is made of {track.devices.length} device(s).</p>
              </div>

              <For each={track.devices}>
                {track => (
                  <MidiDevice device={track} />
                )}
              </For>
            </div>
          )}
        </For>
      </div>

      <h2 class="text-center font-medium text-2xl">
        Audio tracks
      </h2>

      <div class="flex flex-col gap-4 my-6">
        <For each={props.abletonData.tracksData}>
          {track => (track.type === "audio") && (
            <div>
              <h4>{track.name}</h4>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

/**
 * General `MidiDevice` component.
 *
 * You only need to pass the `device` prop and
 * it will automatically decides whose component to mount.
 *
 * TODO: Maybe more optimizations about the `when` prop ?
 * Help was already
 */
const MidiDevice: Component<{
  device: MidiTrackData["devices"][number]
}> = (props) => (
  <Switch>
    <Match when={props.device.type === "sample" && props.device}>
      {device => <MidiDeviceSample sample={device} />}
    </Match>

    <Match when={props.device.type === "drum_rack" && props.device}>
      {device => <MidiDeviceDrumRack drum_rack={device} />}
    </Match>

    <Match when={props.device.type === "instrument_rack" && props.device}>
      {device => <MidiDeviceInstrumentRack instrument_rack={device} />}
    </Match>
  </Switch>
);

const MidiDeviceSample: Component<{
  sample: MidiDeviceSampleData
}> = (props) => {
  /** Get a percentage of the `value` depending on `sample_length`. */
  const inPercent = (value: number) =>  (value / props.sample.sample_length) * 100;

  /** Duration of the sample in percent. */
  const duration_percent = () => inPercent(props.sample.duration);
  /** Start time of the sample in percent. */
  const start_time_percent = () => inPercent(props.sample.start_time);

  return (
    <div class="bg-gray-600 p-2 rounded-lg">
      <h4>Sample: {props.sample.name} ({props.sample.relative_path})</h4>

      <div class="relative w-full bg-gray-200 h-4 dark:bg-gray-700 rounded-md">
        <div
          class="absolute bg-blue-600 h-full rounded-sm"
          style={{
            width: `${duration_percent()}%`,
            left: `${start_time_percent()}%`
          }} />
      </div>
    </div>
  );
};
/**
 * Renders a Drum Rack with a Launchpad preview.
 *
 * TODO: Optimize the effect and cleanup, if possible (?)
 */
const MidiDeviceDrumRack: Component<{
  drum_rack: MidiDeviceDrumRackData
}> = (props) => {
  const [selectedBranch, setSelectedBranch] = createSignal(0);
  let launchpad_ref: HTMLDivElement | undefined;

  createEffect(() => {
    if (!launchpad_ref) return;
    const launchpad = launchpad_ref;

    props.drum_rack.branches.forEach((branch, currentBranchIndex) => {
      const note = branch.receivingNote;

      const padElement = launchpad.querySelector(`[data-note="${note}"]`);
      if (!padElement) return;

      /** Disable the default color. */
      padElement.classList.toggle("bg-gray-400", false);

      /** Highlight the pads. Highlight the selected pad in a lighter color. */
      padElement.classList.toggle(
        selectedBranch() === currentBranchIndex ? "bg-blue-400" : "bg-blue-800",
        true
      );
    });

    onCleanup(() => {
      props.drum_rack.branches.forEach(branch => {
        const note = branch.receivingNote;

        const padElement = launchpad.querySelector(`[data-note="${note}"]`);
        if (!padElement) return;

        /** Disable any highlighted pad. */
        padElement.classList.toggle("bg-blue-400", false);
        padElement.classList.toggle("bg-blue-800", false);

        /** Restore the default color to the pad. */
        padElement.classList.toggle("bg-gray-400", true);
      });
    });
  });


  return (
    <div class="flex justify-between items-center gap-4 flex-col md:flex-row">
      <div class="w-full max-w-60 sm:w-64">
        <Launchpad
          ref={launchpad_ref}
          defaultDeviceType="launchpad_pro_mk2"
          onPadDown={() => null}
          onPadUp={(note_id) => {
            const branch = props.drum_rack.branches.findIndex(
              branch => branch.receivingNote === note_id
            );

            if (branch === -1) return;
            setSelectedBranch(branch);
          }}
        />
      </div>

      <div class="w-full text-center">
        <h4>Preview of a Drum Rack with {props.drum_rack.branches.length} branches.</h4>
        <p>Viewing branch {selectedBranch()} (receivedNote: {props.drum_rack.branches[selectedBranch()].receivingNote})</p>

        <For each={props.drum_rack.branches[selectedBranch()].devices}>
          {device => <MidiDevice device={device}/>}
        </For>
      </div>
    </div>
  );
};

const MidiDeviceInstrumentRack: Component<{
  instrument_rack: MidiDeviceInstrumentRackData
}> = (props) => {
  const [selectedBranch, setSelectedBranch] = createSignal(0);

  return (
    <div>
      <h5>InstrumentRack: {props.instrument_rack.name}</h5>

      <div class="bg-gray-600 flex flex-wrap mb-5">
        <For each={props.instrument_rack.branches}>
          {(branch, branch_index) => (
            <button
              class={`
                px-4 py-2 ${selectedBranch() === branch_index()
              ? "bg-blue-600"
              : "bg-gray-800 hover:bg-opacity-60"
            }
              `}
              onClick={() => setSelectedBranch(branch_index())}
            >
              {branch.name}
            </button>
          )}
        </For>
      </div>

      <For each={props.instrument_rack.branches[selectedBranch()]?.devices}>
        {device => <MidiDevice device={device}/>}
      </For>
    </div>
  );
};

const UtilitiesAbletonParse: Component = () => {
  const [state, setState] = createStore<{
    abletonData: ParsedAbletonData | null,
    error: string | null
  }>({
    abletonData: null,
    error: null
  });

  const alsImportHandler: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
    event.preventDefault();

    // Reset every states.
    setState({
      abletonData: null,
      error: null
    });

    // Check if a file has been uploaded.
    const files = event.currentTarget.files;
    if (!files || files.length <= 0) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const buffer = reader.result as ArrayBuffer;

      try {
        const ableton_file = await readAbletonFile(buffer);

        const parsedAbletonFile = await parseAbletonData(ableton_file);

        setState({
          abletonData: parsedAbletonFile,
          error: null
        });
      }
      catch (error) {
        console.error("Error while parsing Ableton file.", error);

        setState({
          abletonData: null,
          error: "An error was thrown while parsing the file."
        });
      }
    };

    const file = files[0];
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h1>Ableton Parse</h1>
      <p>
        Give a .als file, and you should be able to get an XML response
        in the console.
      </p>

      <FileInput
        label="Import .als file"
        accept=".als"
        multiple={false}
        onChange={alsImportHandler}
      />

      <Show when={state.abletonData}
        fallback={
          <Show when={state.error} fallback={<p>Not loaded.</p>}>
            <p>
              Sorry, but something went wrong.
              Please try again.
            </p>
          </Show>
        }
      >
        <AbletonParsedResults
          abletonData={state.abletonData as ParsedAbletonData}
        />
      </Show>
    </div>
  );
};

export default UtilitiesAbletonParse;
