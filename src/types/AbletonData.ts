export interface AudioTrackData {
  type: "audio";
  name: string;
}

export interface MidiTrackData {
  type: "midi";
  name: string;
  devices: (
    | MidiDeviceInstrumentRackData
    | MidiDeviceDrumRackData
    | MidiDeviceSampleData  
  )[];
}

export interface ParsedAbletonData {
  abletonVersion: string;
  tracksData: (AudioTrackData | MidiTrackData)[]
}

export interface MidiDeviceInstrumentRackData {
  name: string;
  type: "instrument_rack";

  branches: MidiDeviceInstrumentRackBranchData[];
}

export interface MidiDeviceInstrumentRackBranchData {
  name: string;
  devices: (
    | MidiDeviceInstrumentRackData
    | MidiDeviceDrumRackData
    | MidiDeviceSampleData  
  )[];
}

export interface MidiDeviceDrumRackData {
  name: string;
  type: "drum_rack";

  branches: MidiDeviceDrumRackBranchData[];
}

export interface MidiDeviceDrumRackBranchData {
  name: string;
  devices: (
    | MidiDeviceInstrumentRackData
    | MidiDeviceDrumRackData
    | MidiDeviceSampleData  
  )[];

  /** MIDI note assigned to the drum pad. */
  receivingNote: number;
}

export interface MidiDeviceSampleData {
  name: string;
  type: "sample";

  /** Length of the entire sample. */
  sample_length: number;
  start_time: number;
  end_time: number;
  duration: number;

  relative_path: string;
}
