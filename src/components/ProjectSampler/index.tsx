import type { ChangeEvent } from "react";

import FileInput from "@/components/FileInput";

export default function ProjectSampler () {

  const handleAudioImport = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    if (!files || files.length <= 0) return;

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result as ArrayBuffer;
        console.log(file.name, file.type, file.webkitRelativePath, data);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="
      w-full h-64 rounded-lg
      mb-8 py-4
      bg-gray-900
    ">
      <div className="
        px-4 flex justify-between
      ">
        <h3 className="font-medium text-lg">
          Sampler
        </h3>

        <div>
          <FileInput
            label="Import"
            accept="audio/*"
            multiple={true}
            onChange={handleAudioImport}
          />
        </div>
      </div>
    </div>
  );
}