import type { ProjectData } from "@/types/Project";
import type { ChangeEvent } from "react";

import logger from "@/utils/logger";
import { useEffect } from "react";
import create from "zustand";

import FileInput from "@/components/FileInput";
import Input from "@/components/Input";
import AudioWave from "./AudioWave";
import Select from "../Select";

import { useCurrentProjectStore } from "@/stores/current_project";
import { useUnsavedProjectStore } from "@/stores/unsaved_project";

import Button from "../Button";
import { HiOutlineTrash } from "react-icons/hi";

export const useProjectSamplerData = create<{
  /** Path of the file. */
  selectedAudioFile: string | null;
  setSelectedAudioFile: (file_path: string | null) => void;
    }>(set => ({
      selectedAudioFile: null,
      setSelectedAudioFile: (file_path) => set(() => ({ selectedAudioFile: file_path }))
    }));

export default function ProjectSampler () {
  const log = logger("/:slug~ProjectSampler");
  /** Debug. */ log.render();

  const { data, setData } = useUnsavedProjectStore();
  const projectSlug = useCurrentProjectStore(state => state.slug);
  const { selectedAudioFile, setSelectedAudioFile } = useProjectSamplerData();

  useEffect(() => {
    if (selectedAudioFile || !data) return;

    const firstItemInSelector = Object.keys(data.files)[0] || null;
    setSelectedAudioFile(firstItemInSelector);
  }, []);

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
      ...data,
      files: {
        ...data.files,
        ...parsed_files
      }
    };

    // Save files in store.
    setData(updated_data);

    // Reset the file input.
    evt.target.value = "";

    const firstItemInSelector = Object.keys(updated_data.files)[0] || null;
    setSelectedAudioFile(firstItemInSelector);
  };

  const removeCurrentAudioFile = async () => {
    if (!selectedAudioFile || !data || !projectSlug) return;
    
    const files_copy = { ...data.files };
    delete files_copy[selectedAudioFile];

    setData({
      ...data,
      files: files_copy
    });

    const firstItemInSelector = Object.keys(files_copy)[0] || null;
    setSelectedAudioFile(firstItemInSelector);    
  };

  if (!data) return (
    <p>Loading data...</p>
  );

  return (
    <div className="
      w-full rounded-lg
      mb-8 py-4
      bg-gray-700
    ">
      <div className="
        px-8 flex justify-between items-center mb-4 
      ">
        <h3 className="font-medium text-lg">
          Sampler
        </h3>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            
            value={data.global_bpm.toString()}
            min={0}
            max={900} /** If someone has already covered something that has more than 900 BPM, call me. */

            placeholder="BPM"
            onChange={evt => {
              const value = evt.target.value || "0";

              const bpm = parseInt(value);
              if (isNaN(bpm)) return;

              setData({
                ...data,
                global_bpm: bpm
              });
            }}
          />

          <FileInput
            label="Import"
            accept="audio/*"
            multiple={true}
            onChange={handleAudioImport}
          />
        </div>
      </div>

      <div className="px-6">
        <div className="flex gap-2 justify-around">
          <Select
            placeholder="Select an audio file"
            title="Select an audio file"
            value={selectedAudioFile ?? undefined}
            onChange={(evt) => {
              const value = evt.target.value;
              if (!value) {
                setSelectedAudioFile(null);
                return;
              }

              setSelectedAudioFile(value);
            }}
          >
            {Object.keys(data.files).map((file_path, file_index) => (
              <option
                key={file_index}
                value={file_path}
              >
                {data.files[file_path].name}
              </option>
            ))}
          </Select>

          {selectedAudioFile && (
            <Button
              className="hover:text-pink-600 hover:border-pink-600"
              title="Remove the current audio file"
              onClick={removeCurrentAudioFile}
            >
              <HiOutlineTrash size={18} />
            </Button>
          )}
        </div>

        {selectedAudioFile && (
          <AudioWave
            file={data.files[selectedAudioFile]}
          >
            {/** TODO: Write here the grid for tempo, markers, and all the stuff. */}
          </AudioWave>
        )}
      </div>
    </div>
  );
}