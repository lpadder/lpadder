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
    <div>
      <h4>Sample: {sample.name} ({sample.relative_path})</h4>

      <div className="relative w-full bg-gray-200 h-2.5 dark:bg-gray-700">
        <div
          className="absolute bg-blue-600 h-full"
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
  const launchpadRef = useRef<HTMLDivElement>(null);

  /** Function to toggle preview buttons on the Launchpad. */
  const toggleLaunchpadPads = (enable: boolean) => {
    if (!launchpadRef.current) return;
    const launchpad = launchpadRef.current;

    drum_rack.branches.forEach(branch => {
      const note = branch.receivingNote;
      
      const padElement = launchpad.querySelector(`[data-note="${note}"]`);
      if (!padElement) return;

      padElement.classList.toggle("bg-blue-600", enable);
    });
  };

  useEffect(() => {
    toggleLaunchpadPads(true);
    return () => toggleLaunchpadPads(false);
  }, [drum_rack]);

  const [selectedBranch, setSelectedBranch] = useState(0);

  return (
    <div className="flex justify-between">
      <div className="h-64 aspect-square">
        <Launchpad
          ref={launchpadRef}
          layout="programmer"
          onPadDown={() => null}
          onPadUp={(note_id) => {
            console.log("pad up", note_id);
            setSelectedBranch(note_id);
          }}
        />
      </div>

      <div>
        <h4>Drum Rack: {drum_rack.branches.length}</h4>
        <p>Viewing branch {selectedBranch}</p>

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