export type CleanedAbletonData = {
  abletonVersion: string;
  tracksData: TrackData[];
};

export default function parseAbletonData (
  project: Document
): CleanedAbletonData {

  // Short-hands
  const notFound = "Not found !";
  const getFirstElementByTag = (tag: string) => {
    const element = project.getElementsByTagName(tag)[0];
    if (!element) {
      throw new Error(`${tag} not found !`);
    }

    return element;
  };

  // Get Ableton version (ex.: "Ableton Live 11.0.11").
  const abletonVersion = getFirstElementByTag("Ableton").getAttribute("Creator") ?? notFound;

  // Get tracks data (in JSON).
  const tracksData = getTracksData(getFirstElementByTag("Tracks"));

  return {
    abletonVersion,
    tracksData
  };
}

type TrackData = {
  type: "midi" | "audio";
  name: string;
}

/**
 * Remind: we only care about Audio and Midi tracks.
 * We only care about the tracks that are used in a Launchpad project.
 * (so we don't need to check EVERY values :D)
 */
function getTracksData (tracks: Element) {
  const tracksData: TrackData[] = [];  // Initialize the output array.

  const getTrackName = (track: Element) => {
    return track.getElementsByTagName("EffectiveName")[0].getAttribute("Value") as string;
  }
  
  for (const track of tracks.children) {
    // We check the track type as we
    // only check Audio and Midi tracks.
    const trackType = track.tagName;
    if (trackType === "AudioTrack" || trackType === "MidiTrack") {
      // There's nothing much interesting in AudioTracks,
      // what's interesting is looking if there's samples reference.
      if (trackType === "AudioTrack") {
        tracksData.push({
          type: "audio",
          name: getTrackName(track)
        });
      }

      // Most interesting is MidiTracks.
      // Here, there's all the logic behind a Launchpad project.
      // As of Instrument Racks, Drum Racks, Plug-ins, ...
      else if (trackType === "MidiTrack") {

        // Get `DeviceChain` element => Contains the list of devices in the track.
        const deviceChainGlobal = track.getElementsByTagName("DeviceChain")[0];
        // Get `DeviceChain` in the `DeviceChain` element (yes).
        const deviceChain = deviceChainGlobal.getElementsByTagName("DeviceChain")[0];
        const devices = deviceChain.getElementsByTagName("Devices")[0];

        // Debug
        console.log(devices);

        tracksData.push({
          type: "midi",
          name: getTrackName(track)
        });
      }
    }
  }

  return tracksData;
}