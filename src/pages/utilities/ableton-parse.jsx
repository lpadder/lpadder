import { useState } from "react";
import pako from "pako";

import parseAbletonData from "../../utils/parseAbletonData";

export default function UtilitiesAbletonParse () {
  const [cleanedData, setCleanedData] = useState();
  const [isError, setIsError] = useState(false);

  /** @param {React.ChangeEvent<HTMLInputElement>} evt */
  const alsImportHandler = (evt) => {
    evt.preventDefault();

    // Check if a file has been uploaded.
    const files = evt.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Read the ".als" file as a binary string.
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result;
        const array = new Uint8Array(buffer);

        // Decompress the binary string into a string.
        const ungziped = pako.ungzip(array);
        const xmlString = new TextDecoder("utf-8").decode(ungziped);

        // Parse the string into a XML object.
        const xmlParser = new DOMParser();
        const xmlParsed = xmlParser.parseFromString(xmlString, "text/xml");

        // Save the parsed Ableton file in state.
        const cleanedData = parseAbletonData(xmlParsed);
        setCleanedData(cleanedData);

        console.log(cleanedData);

        // Reset every other state.
        setIsError(false);
      }

      // Load the file.
      reader.readAsArrayBuffer(file);
    }
    else {
      setIsError(true);
    }
  };

  return (
    <div>
      <h1>Ableton Parse</h1>
      <p>
        Give a .als file, and you should be able to get an XML response
        in the console.
      </p>

      <input
        type="file"
        accept=".als"
        multiple={false}
        onChange={alsImportHandler}
      />

      {cleanedData
        ? <div>
            <h2>Loaded !</h2>
            <p>
              <strong>Ableton Used: </strong> {cleanedData.abletonVersion}
            </p>
          </div>
        : <h2>Not loaded.</h2>
      }

      {isError
        && <p>
          Sorry, but something went wrong. Please try again.
          Don't forget to select a <strong>.als</strong> file.
        </p>
      }
    </div>
  );
}