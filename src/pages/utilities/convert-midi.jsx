import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Midi } from "@tonejs/midi";

export default function UtilitiesConvertMidiFile () {
  const [fromLayout, setFromLayout] = useState("live");
  const [toLayout, setToLayout] = useState("programmer");

  const [uploadedFiles, setUploadedFiles] = useState(null);
  const [convertedFiles, setConvertedFiles] = useState([]);

  /** @param {React.ChangeEvent<HTMLInputElement>} evt */
  const handleMidiUpload = (evt) => {
    const files = evt.target.files;

    if (files) {
      setUploadedFiles(files);
    }
  };
  
  /**
   * @param {Uint8Array} data 
   * @param {string} fileName 
   */
  const downloadBlob = (data, fileName = "converted") => {
    const blob = new Blob([data], {
      type: "audio/midi"
    })
  
    // Creating an element to auto-download the file.
    const url = window.URL.createObjectURL(blob);
    const aInput = document.createElement("a");

    aInput.setAttribute("href", data);
    aInput.setAttribute("download", fileName);
    
    // Append it to the DOM.
    document.body.appendChild(a);
    aInput.style.display = "none";

    // Download href and remove the element.
    a.click();
    a.remove();
  
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  }

  const startConvert = () => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const reader = new FileReader();

        reader.onload = () => {
          const buffer = reader.result;
          const midi = new Midi(buffer);
          console.log(midi);
          
          const output = midi.toArray();
          downloadBlob(output, file.name);
        }
        
        reader.readAsArrayBuffer(file);
      }
    }
  }

  return (
    <div>
      <Link to="../">Go back to utilities</Link>
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