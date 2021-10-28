import { useState } from "react";
import pako from "pako";

export default function UtilitiesAbletonParse () {
  const [parsedAbleton, setParsedAbleton] = useState("");

  const alsImportHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();

    if (evt.target.files && evt.target.files.length > 0) {
      const file = evt.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        console.log(buffer);
        const array = new Uint8Array(buffer);

        const ungziped = pako.ungzip(array);
        const alsString = new TextDecoder("utf-8").decode(ungziped);

        setParsedAbleton(alsString);
      }

      reader.readAsArrayBuffer(file);
    }
    else {
      console.error('No file selected');
    }
  };

  return (
    <div>
      <h1>Ableton Parse</h1>
      <p>
        Give a .als file, and you should be able to get an XML response
        in the console. This is useful for debugging.
      </p>

      <input
        type="file"
        onChange={alsImportHandler}
      />

      <pre>
        {parsedAbleton}
      </pre>
    </div>
  );
}