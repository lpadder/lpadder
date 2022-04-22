import type { ProjectData } from "@/types/Project";
import type { ChangeEvent } from "react";
import type WaveSurferType from "wavesurfer.js";

import logger from "@/utils/logger";

import { WaveSurfer, WaveForm } from "wavesurfer-react";
import FileInput from "@/components/FileInput";

import { useCurrentProjectStore } from "@/stores/current_project";
import { useUnsavedProjectStore } from "@/stores/unsaved_project";
import { storedProjectsData } from "@/stores/projects_data";

export default function ProjectSampler () {
  const log = logger("/:slug~ProjectSampler");
  /** Debug. */ log.render();

  const { data, setData } = useUnsavedProjectStore();
  const projectSlug = useCurrentProjectStore(state => state.slug);

  /** Handle the <FileInput /> to import audios and store them. */
  const handleAudioImport = async (evt: ChangeEvent<HTMLInputElement>) => {
    if (!data || !projectSlug) return;

    const files = evt.target.files;
    if (!files || files.length <= 0) return;

    const parsed_files: ProjectData["files"] = {};
    const files_promises = Array.from(files).map(file => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const data_buffer = reader.result as ArrayBuffer;

            /** Default path used by lpadder. */
            const file_path = "Samples/";
            let file_name = file.name;

            /**
             * Check if the file already exists in store or in this import.
             * If it does, we add a number to the `file_name`.
             */
            if (
              data.files[file_path + file_name]
              || parsed_files[file_path + file_name]
            ) {
              // If so, add a number to the file name.
              let file_name_number = 1;
              while (
                data.files[file_path + file_name]
                || parsed_files[file_path + file_name]
              ) {
                file_name = `${file.name}_${file_name_number}`;
                file_name_number++;
              }
            }

            parsed_files[file_path + file_name] = {
              data: data_buffer,
              name: file_name,
              path: file_path,
              type: file.type
            };

            resolve();
          }
          catch (err) {
            reject(err);
          }
        };
        
        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsArrayBuffer(file);
      });
    });

    // Read every files and parse them.
    await Promise.all(files_promises);

    const updated_data: ProjectData = {
      launchpads: [ ...data.launchpads ],
      files: { ...data.files, ...parsed_files }
    };

    // Save files in localForage and store.
    await storedProjectsData.updateProjectData(projectSlug, updated_data);
    setData(updated_data);

    // Reset the file input.
    evt.target.value = "";
  };

  if (!data) return (
    <p>Loading data...</p>
  );

  return (
    <div className="
      w-full h-64 rounded-lg
      mb-8 py-4
      bg-gray-700
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


      {/** Audio files */}
      <div>
        {Object.keys(data.files).map((file_path, file_index) => (
          <div className="w-full h-auto" key={file_path}>
            <WaveSurfer
              onMount={(waveSurfer: WaveSurferType) => {
                const file = data.files[file_path];

                const blob = new Blob([file.data], { type: file.type });
                waveSurfer.loadBlob(blob);
              }}
            >
              <WaveForm id={`waveform-${file_index}`} hideCursor cursorColor="transparent">
                {}
              </WaveForm>
            </WaveSurfer>
          </div>
        ))}
      </div>
    </div>
  );
}