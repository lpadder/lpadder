import type {
  ParsedAbletonData,

  AudioTrackData,
  MidiTrackData,

  MidiDeviceSampleData,

  MidiDeviceDrumRackData,
  MidiDeviceDrumRackBranchData,

  MidiDeviceInstrumentRackData,
  MidiDeviceInstrumentRackBranchData
} from "@/types/AbletonData";

import pako from "pako";
import { convertNoteLayout } from "./devices";

/**
 * Read an Ableton Live Set (.als) and returns its data in XML.
 * @param buffer - File buffer containing the `.als` file.
 */
export const readAbletonFile = (buffer: ArrayBuffer) => new Promise<Document>((resolve, reject) => {
  try {
    const array = new Uint8Array(buffer);

    // Ungzip the file and store it as a UTF-8 string.
    const ungzipped_file = pako.ungzip(array);
    const raw_file_content = new TextDecoder("utf-8").decode(ungzipped_file);

    // Transform the file content from string to XML.
    const xml_parser = new DOMParser();
    const file_content = xml_parser.parseFromString(raw_file_content, "text/xml");

    resolve(file_content);
  }
  catch (error) {
    console.error("[utils/readAbletonFile] Error while reading the file.", error);
    reject("Error while reading the file.");
  }
});

/** Parse an .als (Ableton Live Set) project. */
export const parseAbletonData = (project: Document) => new Promise<ParsedAbletonData>((resolve, reject) => {
  const getFirstElementByTag = (tag: string) => {
    const element = project.getElementsByTagName(tag)[0];
    if (!element) {
      throw new Error(`${tag} not found !`);
    }

    return element;
  };

  try {
    /** Ableton version (ex.: "Ableton Live 11.0.1"). */
    const abletonVersion = getFirstElementByTag("Ableton")
      .getAttribute("Creator") as string;

    /** Get tracks data in project. */
    const tracksData = getTracksData(getFirstElementByTag("Tracks"));

    resolve({
      abletonVersion,
      tracksData
    });
  }
  catch (error) {
    console.error("[utils/parseAbletonData] Error while parsing the file.", error);
    reject(error);
  }
});

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
        name: audio_track_name
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

    /** We only care about these devices. */
    if (!(
      deviceType === "InstrumentGroupDevice"
      || deviceType === "DrumGroupDevice"
      || deviceType === "OriginalSimpler"
    )) continue;

    switch (deviceType) {

    /** This is the instrument rack. */
    case "InstrumentGroupDevice": {
      const instrumentRackData = parseInstrumentRack(device);
      parsed_devices.push(instrumentRackData);
      break;
    }

    /** This is the drum rack. */
    case "DrumGroupDevice": {
      const drumRackData = parseDrumRack(device);
      parsed_devices.push(drumRackData);
      break;
    }

    /** This is the sampler. */
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

      const sampleFullLength = parseInt(device
        .getElementsByTagName("DefaultDuration")[0]
        .getAttribute("Value") || "-1");

      const sample_file_ref = sample_data.getElementsByTagName("FileRef")[0];

      const sample_file_relative_path_element = sample_file_ref.getElementsByTagName("RelativePath")[0];
      let sample_file_relative_path = "";

      /** Behaviour on Ableton Live <11 */
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
      const sample_length = sampleFullLength / sampleRate;

      const sample: MidiDeviceSampleData = {
        name: sample_name,
        type: "sample",

        sample_length,
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
      .getElementsByTagName("EffectiveName")[0]
      .getAttribute("Value") || "";

    parsed_branches.push({
      name: branch_name,
      devices: getDevicesFromMidiGroup(branch, "device")
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
      .getElementsByTagName("EffectiveName")[0]
      .getAttribute("Value") || "";

    /**
     * Find the note attributed to the drum pad.
     * When not found, we return `-1`.
     */
    const receivingNote = parseInt(branch
      .getElementsByTagName("ReceivingNote")[0]
      .getAttribute("Value") || "-1");


    // We convert the note from Live's drum rack layout to programmer layout.
    let parsedReceivingNote = receivingNote;
    const convert = convertNoteLayout(receivingNote, "live_drum_rack", "programmer");
    if (convert.success) {
      parsedReceivingNote = convert.note;
    }

    parsed_branches.push({
      name: branch_name,
      receivingNote: parsedReceivingNote,
      devices: getDevicesFromMidiGroup(branch, "device")
    });
  }

  return {
    name,
    type: "drum_rack",
    branches: parsed_branches
  };
}
