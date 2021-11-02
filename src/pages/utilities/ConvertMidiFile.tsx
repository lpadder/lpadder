import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Midi } from "@tonejs/midi";

import * as LpLayout from "../../utils/launchpadLayout";

export default function UtilitiesConvertMidiFile () {
  const [fromLayout, setFromLayout] = useState("live");
  const [toLayout, setToLayout] = useState("programmer");

  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [convertedFiles, setConvertedFiles] = useState<any[]>([]);

  const handleMidiUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;

    if (files) {
      setUploadedFiles(files);
    }
  }

  const downloadURL = (data: string, fileName = "converted") => {
    const a = document.createElement('a')
    a.href = data
    a.download = fileName
    document.body.appendChild(a)
    a.style.display = 'none'
    a.click()
    a.remove()
  }
  
  const downloadBlob = (data: Uint8Array, fileName = "converted") => {
    const blob = new Blob([data], {
      type: "audio/midi"
    })
  
    const url = window.URL.createObjectURL(blob)
  
    downloadURL(url, fileName)
  
    setTimeout(() => window.URL.revokeObjectURL(url), 1000)
  }

  const startConvert = () => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];

        const reader = new FileReader();

        reader.onload = () => {
          const buffer = reader.result as ArrayBuffer;
          const midi = new Midi(buffer);
          console.log(midi);
          
          const output = midi.toArray();
          downloadBlob(output, file.name);
          console.log(output);
        }
        
        reader.readAsArrayBuffer(file);
      }
    }
  }

  return (
    <div>
      <Link to="/utilities">Go back to utilities</Link>
      <h1>Convert layout of MIDI files</h1>
      <p>
        Imagine you have a MIDI file for a Launchpad Live layout and
        (you don't know why) you want to convert it to a Launchpad Programmer layout,
        then you're at the right place ! <br /> <br />

        You'll be able to upload multiple files at once, and the conversion will be done.
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
  )
}