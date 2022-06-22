import type { Component } from "solid-js";
import type { AvailableLayouts } from "@/utils/LaunchpadLayout";

import { Midi } from "@tonejs/midi";

import downloadBlob from "@/utils/downloadBlob";

const UtilitiesConvertMidi: Component = () => {
  const [fromLayout, setFromLayout] = createSignal<AvailableLayouts>("live");
  const [toLayout, setToLayout] = createSignal<AvailableLayouts>("programmer");

  const [uploadedFiles, setUploadedFiles] = createSignal<FileList | null>(null);
  // const [convertedFiles, setConvertedFiles] = useState([]);

  const handleMidiUpload = (evt: Event & {
    currentTarget: HTMLInputElement;
  }) => {
    const files = evt.currentTarget.files;
    if (!files) return;

    setUploadedFiles(files);
  };

  const startConvert = () => {
    const files = uploadedFiles();
    if (!files || files.length <= 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const midi = new Midi(buffer);
          
        // Convert midi object to array and download it.
        const output = midi.toArray();
        downloadBlob(output, file.name, "audio/midi");
      };
        
      // Read MIDI file as ArrayBuffer.
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <h1>Convert layout of MIDI files</h1>
      <p>
        Imagine you have a MIDI file for a Launchpad Live layout and
        you want to convert it to a Launchpad Programmer layout,
        then you&apos;re at the right place ! <br /> <br />

        You&apos;ll be able to upload multiple files at once, and the conversion will be done.
      </p>

      <input
        type="file"
        accept=".mid"
        multiple={true}
        onChange={handleMidiUpload}
      />

      <label
        for="midiLayoutFrom"
      >
        From
      </label>
      <select
        value={fromLayout()}
        onChange={(e) => setFromLayout(e.currentTarget.value as AvailableLayouts)}
        id="midiLayoutFrom"
      >
        <option value="live">
          Live Layout
        </option>
        <option value="programmer">
          Programmer Layout
        </option>
      </select>

      <label
        for="midiLayoutTo"
      >
        To
      </label>
      <select
        value={toLayout()}
        onChange={(e) => setToLayout(e.currentTarget.value as AvailableLayouts)}
        id="midiLayoutTo"
      >
        <option value="live">
          Live Layout
        </option>
        <option value="programmer">
          Programmer Layout
        </option>
      </select>

      <Show when={uploadedFiles && uploadedFiles.length > 0}>
        <button onClick={startConvert}>
          Convert {uploadedFiles.length} MIDI files from {fromLayout()} to {toLayout()}.
        </button>
      </Show>
    </div>
  );
};

export default UtilitiesConvertMidi;
