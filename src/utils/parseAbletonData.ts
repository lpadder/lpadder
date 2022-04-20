/** Parse an .als (Ableton Live Set) project. */
export default function parseAbletonData (project: Document) {
  const getFirstElementByTag = (tag: string) => {
    const element = project.getElementsByTagName(tag)[0];
    if (!element) {
      throw new Error(`${tag} not found !`);
    }

    return element;
  };

  // Get Ableton version (ex.: "Ableton Live 11.0.11").
  const abletonVersion = getFirstElementByTag("Ableton").getAttribute("Creator") as string;

  // Get tracks data (in JSON).
  const tracksData = getTracksData(getFirstElementByTag("Tracks"));

  return {
    abletonVersion,
    tracksData
  };
}

interface AudioTrackData {
  type: "audio";
  name: string;
}

interface MidiTrackData {
  type: "midi";
  name: string;
  devices: (
    | MidiDeviceInstrumentRackData
    | MidiDeviceDrumRackData
    | MidiDeviceSampleData  
  )[];
}

/** Parse the tracks of the project. */
function getTracksData (tracks: Element) {
  const tracksData: (AudioTrackData | MidiTrackData)[] = []; 
  
  for (const track of tracks.children) {
    /** We get the type of the track. */
    const trackType = track.tagName;

    /** We only care about `AudioTrack`s and `MidiTrack`s. */
    if (!(trackType === "AudioTrack" || trackType === "MidiTrack")) continue;

    /** Get the track name from `Value` attribute on `EffectiveName` element. */
    const getTrackName = (track: Element) => {
      return track.getElementsByTagName("EffectiveName")[0].getAttribute("Value") || "";
    };

    /** We parse the audio tracks. */
    switch (trackType) {
    case "AudioTrack": {
      const audio_track_name = getTrackName(track);

      tracksData.push({
        type: "audio",
        name: audio_track_name,
      });

      break;
    }
    case "MidiTrack": {
      const midi_track_name = getTrackName(track);
      const midi_track_devices = getDevicesFromMidiGroup(track, "track");

      tracksData.push({
        type: "midi",
        name: midi_track_name,
        devices: midi_track_devices
      });

      break;
    }
    }
  }

  return tracksData;
}

interface MidiDeviceInstrumentRackData {
  name: string;
  type: "instrument_rack";

  branches: MidiDeviceInstrumentRackBranchData[];
}

interface MidiDeviceInstrumentRackBranchData {
  name: string;
  devices: (
    | MidiDeviceInstrumentRackData
    | MidiDeviceDrumRackData
    | MidiDeviceSampleData  
  )[];
}

interface MidiDeviceDrumRackData {
  name: string;
  type: "drum_rack";

  branches: MidiDeviceDrumRackBranchData[];
}

interface MidiDeviceDrumRackBranchData {
  name: string;
  devices: (
    | MidiDeviceInstrumentRackData
    | MidiDeviceDrumRackData
    | MidiDeviceSampleData  
  )[];

  /** MIDI note assigned to the drum pad. */
  receivingNote: number;
}

interface MidiDeviceSampleData {
  name: string;
  type: "sample";

  start_time: number;
  end_time: number;
  duration: number;

  relative_path: string;
}

function getDevicesFromMidiGroup (group: Element, from: "track" | "device") {
  // `DeviceChain` => Contains the list of the list of devices in the group.
  const deviceChainGlobal = group.getElementsByTagName("DeviceChain")[0];
  // `DeviceChain` in the `DeviceChain` => Contains the list of devices in the group.
  const deviceChain = deviceChainGlobal
    .getElementsByTagName(
      from === "track" ? "DeviceChain" : "MidiToAudioDeviceChain"
    )[0];

  const devices = deviceChain.getElementsByTagName("Devices")[0];
  const parsed_devices: (
    | MidiDeviceInstrumentRackData
    | MidiDeviceDrumRackData
    | MidiDeviceSampleData
  )[] = [];
  
  /** We parse the devices in the group. */
  for (const device of devices.children) {
    /** We get the type of the device. */
    const deviceType = device.tagName;

    /** We only care about `InstrumentGroupDevice`s and `DrumGroupDevice`s. */
    if (!(
      deviceType === "InstrumentGroupDevice"
      || deviceType === "DrumGroupDevice"
      || deviceType === "OriginalSimpler"  
    )) continue;

    switch (deviceType) {
    case "InstrumentGroupDevice": {
      const instrumentRackData = parseInstrumentRack(device);
      parsed_devices.push(instrumentRackData);
      break;
    }
    case "DrumGroupDevice": {
      const drumRackData = parseDrumRack(device);
      parsed_devices.push(drumRackData);
      break;
    }
    case "OriginalSimpler": {
      const sample_data = device.getElementsByTagName("MultiSamplePart")[0];
      const sample_name = sample_data.getElementsByTagName("Name")[0].getAttribute("Value") || "";

      const sampleRate = parseInt(device
        .getElementsByTagName("DefaultSampleRate")[0]
        .getAttribute("Value") || "-1");
  
      const sampleStart = parseInt(device
        .getElementsByTagName("SampleStart")[0]
        .getAttribute("Value") || "-1");
  
      const sampleEnd = parseInt(device
        .getElementsByTagName("SampleEnd")[0]
        .getAttribute("Value") || "-1");

      const sample_file_ref = sample_data.getElementsByTagName("FileRef")[0];

      const sample_file_relative_path_element = sample_file_ref.getElementsByTagName("RelativePath")[0];
      let sample_file_relative_path = "";

      /** Beaviour on Ableton Live <11 */
      if (sample_file_relative_path_element.children.length > 0) {
        for (const relativePathElement of sample_file_relative_path_element.children) {
          if (relativePathElement.tagName !== "RelativePathElement") continue;
          
          const dir = relativePathElement.getAttribute("Dir") || "";
          sample_file_relative_path += `${dir}/`;
        }
        
        const sample_file_name = sample_file_ref.getElementsByTagName("Name")[0].getAttribute("Value") || "";
        sample_file_relative_path += sample_file_name;
      }
      /** On Ableton Live >11, the RelativePath element directly gives the path. */
      else if (sample_file_relative_path_element.children.length === 0) {
        sample_file_relative_path = sample_file_relative_path_element.getAttribute("Value") || "";
      }

      // Values in seconds.
      const start_time = sampleStart / sampleRate;
      const end_time = sampleEnd / sampleRate;
      const duration = end_time - start_time;

      const sample: MidiDeviceSampleData = {
        name: sample_name,
        type: "sample",

        start_time,
        end_time,
        duration,

        relative_path: sample_file_relative_path
      };

      parsed_devices.push(sample);
      break;
    }
    }
  }

  return parsed_devices;
}

/** Get the device name from `Value` attribute on `UserName` element. */
const getDeviceName = (device: Element) => {
  return device.getElementsByTagName("UserName")[0].getAttribute("Value") || "";
};

function parseInstrumentRack (device: Element): MidiDeviceInstrumentRackData {
  const name = getDeviceName(device);

  const branches = device.getElementsByTagName("Branches")[0];
  const parsed_branches: MidiDeviceInstrumentRackBranchData[] = [];

  for (const branch of branches.children) {
    if (branch.tagName !== "InstrumentBranch") continue;

    const branch_name = branch
      .getElementsByTagName("Name")[0]
      .getElementsByTagName("EffectiveName")[0]
      .getAttribute("Value") || "";

    parsed_branches.push({
      name: branch_name,
      devices: getDevicesFromMidiGroup(branch, "device"),
    });
  }

  return {
    name,
    type: "instrument_rack",
    branches: parsed_branches
  };
}

function parseDrumRack (device: Element): MidiDeviceDrumRackData {
  const name = getDeviceName(device);
  
  const branches = device.getElementsByTagName("Branches")[0];
  const parsed_branches: MidiDeviceDrumRackBranchData[] = [];

  for (const branch of branches.children) {
    if (branch.tagName !== "DrumBranch") continue;

    const branch_name = branch
      .getElementsByTagName("Name")[0]
      .getElementsByTagName("EffectiveName")[0]
      .getAttribute("Value") || "";

    /**
     * Find the note attributed to the drum pad.
     * When not found, we return `-1`.
     */
    const receivingNote = parseInt(branch
      .getElementsByTagName("ReceivingNote")[0]
      .getAttribute("Value") || "-1");

    parsed_branches.push({
      name: branch_name,
      receivingNote,
      devices: getDevicesFromMidiGroup(branch, "device")
    });
  }

  return {
    name,
    type: "drum_rack",
    branches: parsed_branches
  };
}