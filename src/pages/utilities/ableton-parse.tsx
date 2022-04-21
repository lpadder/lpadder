import type {
  ParsedAbletonData,
  MidiDeviceSampleData,
  MidiDeviceDrumRackData,
  MidiDeviceInstrumentRackData,
  MidiTrackData
} from "@/utils/parseAbletonData";

import type { ChangeEvent } from "react";
import { useState, useRef, useEffect } from "react";

import FileInput from "@/components/FileInput";
import Launchpad from "@/components/Launchpad";

import {
  readAbletonFile,
  parseAbletonData
} from "@/utils/parseAbletonData";

import logger from "@/utils/logger";

export default function UtilitiesAbletonParse () {
  const [abletonData, setAbletonData] = useState<ParsedAbletonData | null>(null);
  const [error, setError] = useState(false);

  const log = logger("UtilitiesAbletonParse");
  /** Debug. */ log.render();

  const alsImportHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();

    // Reset every states.
    setAbletonData(null);
    setError(false);

    // Check if a file has been uploaded.
    const files = evt.target.files;
    if (!files || files.length <= 0) return;

    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const ableton_file = readAbletonFile(buffer);

      try {
        const parsed_ableton_file = parseAbletonData(ableton_file);
        
        setAbletonData(parsed_ableton_file);
        setError(false);
      }
      catch (e) {
        log.log("Error while parsing Ableton file.", e);
        
        setAbletonData(null);
        setError(true);
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

      {abletonData && (
        <AbletonParsedResults
          abletonData={abletonData}
        />
      )}

      {(!abletonData && !error) && (
        <h2>Not loaded.</h2>
      )}

      {(!abletonData && error) && (
        <p>
          Sorry, but something went wrong.
          Please try again.
        </p>
      )}
    </div>
  );
}

function AbletonParsedResults ({ abletonData }: { abletonData: ParsedAbletonData }) {
  const log = logger("AbletonParsedResults");
  /** Debug. */ log.render();

  const midiTracks = abletonData.tracksData.filter(trackData => trackData.type === "midi");
  const audioTracks = abletonData.tracksData.filter(trackData => trackData.type === "audio");

  return (
    <div>
      <h2
        className="text-center font-medium text-2xl"
      >
        MIDI tracks
      </h2>

      <div className="flex flex-col gap-4 my-6">
        {midiTracks.map((track, track_index) => track.type === "midi" && (
          <div
            className="p-4 bg-gray-900 rounded-lg"
            key={track_index}
          >
            <div className="mb-4">
              <h4 className="font-medium text-lg text-gray-300">{track.name}</h4>
              <p className="text-gray-400">This track is made of {track.devices.length} device(s).</p>
            </div>

            {track.devices.map((track, track_index) =>
              <MidiDevice
                key={track_index}
                device={track}
              />
            )}
          </div>
        ))}
      </div>

      <h2>Audio tracks</h2>

      {audioTracks.map((track, track_index) => (
        <div key={track_index}>
          <h4>{track.name}</h4>
        </div>
      ))}
    </div>
  );
}

const MidiDevice = ({ device }: {
  device: MidiTrackData["devices"][number]
}) => {
  return device.type === "sample" ? (
    <MidiDeviceSample
      sample={device}
    />
  ) : device.type === "drum_rack" ? (
    <MidiDeviceDrumRack
      drum_rack={device}
    />
  ) : (
    <MidiDeviceInstrumentRack
      instrument_rack={device}
    />
  );
};

const MidiDeviceSample = ({ sample }: {
  sample: MidiDeviceSampleData
}) => {
  const durationInPercent = (sample.duration / sample.sample_length) * 100;
  const startTimeInPercent = (sample.start_time / sample.sample_length) * 100;

  return (
    <div className="bg-gray-600 p-2 rounded-lg">
      <h4>Sample: {sample.name} ({sample.relative_path})</h4>

      <div className="relative w-full bg-gray-200 h-4 dark:bg-gray-700 rounded-md">
        <div
          className="absolute bg-blue-600 h-full rounded-sm"
          style={{
            width: `${durationInPercent}%`,
            left: `${startTimeInPercent}%`
          }}></div>
      </div>
    </div>
  );
};

const MidiDeviceDrumRack = ({ drum_rack }: {
  drum_rack: MidiDeviceDrumRackData
}) => {
  const [selectedBranch, setSelectedBranch] = useState(0);
  const launchpadRef = useRef<HTMLDivElement>(null);

  /** Function to toggle preview buttons on the Launchpad. */
  const toggleLaunchpadPads = (enable: boolean) => {
    if (!launchpadRef.current) return;
    const launchpad = launchpadRef.current;

    drum_rack.branches.forEach((branch, currentBranchIndex) => {
      const note = branch.receivingNote;

      const padElement = launchpad.querySelector(`[data-note="${note}"]`);
      if (!padElement) return;

      padElement.classList.toggle(
        /** This is the default color of pads. */ "bg-gray-400",
        !enable
      );

      padElement.classList.toggle(
        selectedBranch === currentBranchIndex ? "bg-blue-400" : "bg-blue-800",
        enable
      );
    });
  };

  /** Update the highlights on the Launchpad. */
  useEffect(() => {
    console.log(drum_rack);
    toggleLaunchpadPads(true);
    return () => toggleLaunchpadPads(false);
  }, [drum_rack, selectedBranch]);

  return (
    <div className="flex justify-between items-center gap-4 flex-col md:flex-row">
      <div className="w-full max-w-60 sm:w-64">
        <Launchpad
          ref={launchpadRef}
          layout="drum_rack"
          onPadDown={() => null}
          onPadUp={(note_id) => {
            const branch = drum_rack.branches.findIndex(branch => branch.receivingNote === note_id);
            if (branch === -1) return;

            setSelectedBranch(branch);
          }}
        />
      </div>

      <div className="w-full text-center">
        <h4>Preview of a Drum Rack with {drum_rack.branches.length} branches.</h4>
        <p>Viewing branch {selectedBranch} (receivedNote: {drum_rack.branches[selectedBranch].receivingNote})</p>

        {drum_rack.branches[selectedBranch].devices.map((device, device_index) => (
          <MidiDevice
            key={device_index}
            device={device}
          />
        ))}
      </div>
    </div>
  );
};

const MidiDeviceInstrumentRack = ({ instrument_rack }: {
  instrument_rack: MidiDeviceInstrumentRackData
}) => {
  const [selectedBranch, setSelectedBranch] = useState(0);

  return (
    <div>
      <h5>InstrumentRack: {instrument_rack.name}</h5>

      <div className="bg-gray-600 flex flex-wrap mb-5">
        {instrument_rack.branches.map((branch, branch_index) => (
          <button
            key={branch_index}
            className={`
              px-4 py-2 ${selectedBranch === branch_index
            ? "bg-blue-600"
            : "bg-gray-800 hover:bg-opacity-60"
          }
            `}
            onClick={() => setSelectedBranch(branch_index)}
          >
            {branch.name}
          </button>
        ))}
      </div>
        

      {instrument_rack.branches[selectedBranch].devices.map((device, device_index) => (
        <MidiDevice
          key={device_index}
          device={device}
        />
      ))}
    </div>
  );
};