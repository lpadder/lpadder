import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Midi } from "@tonejs/midi";

export default function UtilitiesConvertMidiFile () {
  const [fromLayout, setFromLayout] = useState("live");
  const [toLayout, setToLayout] = useState("programmer");

  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  // const [convertedFiles, setConvertedFiles] = useState([]);

  const handleMidiUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;

    if (files) {
      setUploadedFiles(files);
    }
  };
  
  const downloadBlob = (data: Uint8Array, fileName = "converted") => {
    const blob = new Blob([data], {
      type: "audio/midi"
    });
  
    // Creating an element to auto-download the file.
    const url = window.URL.createObjectURL(blob);
    const aInput = document.createElement("a");

    aInput.setAttribute("href", url);
    aInput.setAttribute("download", fileName);
    
    // Append it to the DOM.
    document.body.appendChild(aInput);
    aInput.style.display = "none";

    // Download href and remove the element.
    aInput.click();
    aInput.remove();
  
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  };

  const startConvert = () => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const reader = new FileReader();

        reader.onload = () => {
          const buffer = reader.result as ArrayBuffer;
          const midi = new Midi(buffer);
          
          // Convert midi object to array and download it.
          const output = midi.toArray();
          downloadBlob(output, file.name);
        };
        
        // Read MIDI file as ArrayBuffer.
        reader.readAsArrayBuffer(file);
      }
    }
  };

  return (
    <div>
      <Link to="../">Go back to utilities</Link>
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

      <label htmlFor="midiLayoutFrom">From</label>
      <select defaultValue={fromLayout} onChange={(e) => setFromLayout(e.target.value)} id="midiLayoutFrom">
        <option value="live">
          Live Layout
        </option>
        <option value="programmer">
          Programmer Layout
        </option>
      </select>

      <label htmlFor="midiLayoutTo">To</label>
      <select defaultValue={toLayout} onChange={(e) => setToLayout(e.target.value)} id="midiLayoutTo">
        <option value="live">
          Live Layout
        </option>
        <option value="programmer">
          Programmer Layout
        </option>
      </select>

      {(uploadedFiles && uploadedFiles.length > 0) &&
        <button onClick={startConvert}>
          Convert {uploadedFiles.length} MIDI files from {fromLayout} to {toLayout}.
        </button>
      }
    </div>
  );
}