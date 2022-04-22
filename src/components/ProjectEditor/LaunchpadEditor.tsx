import type { ProjectData, ProjectDataSample } from "@/types/Project";
import type { ChangeEvent } from "react";

import { useRef, useEffect } from "react";
import logger from "@/utils/logger";

// Stores
import { useUnsavedProjectStore } from "@/stores/unsaved_project";

// Components
import Launchpad from "@/components/Launchpad";
import Select from "@/components/Select";
import Input from "@/components/Input";
import { Fragment } from "react";

// Icons
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

interface LaunchpadEditorProps {
  handleLaunchpadSelection: (evt: ChangeEvent<HTMLSelectElement>) => void,
  launchpad: ProjectData["launchpads"][number] & { id: number } | null,
  sample: ProjectDataSample & { id: number } | null,

  addLaunchpad: () => void,
  removeLaunchpad: () => void,

  handleLaunchpadClick: (pad_id: number) => void;
}

export default function LaunchpadEditor ({
  handleLaunchpadSelection,
  launchpad,
  sample,

  addLaunchpad,
  removeLaunchpad,

  handleLaunchpadClick
}: LaunchpadEditorProps) {
  const launchpadRef = useRef<HTMLDivElement>(null);

  const log = logger("/:slug~LaunchpadEditor");
  /** Debug. */ log.render();

  useEffect(() => {
    if (!sample) return;
    if (!launchpadRef.current) return;
    const launchpad = launchpadRef.current;

    const pad_id = sample.id;
    const pad = launchpad.querySelector(`[data-note="${pad_id}"]`);
    if (!pad) return;

    pad.classList.add("bg-blue-600");
    return () => {
      pad.classList.remove("bg-blue-600");
    };
  }, [sample]);

  const { data, setData } = useUnsavedProjectStore();
  if (!data) return <p>Loading...</p>;

  return (
    <div className="
      flex flex-col sm:flex-row gap-4 p-4
      bg-gray-700 rounded-lg w-fit mx-auto
    ">
      <div className="
        max-w-xs sm:w-60 md:w-64 m-auto flex flex-col gap-4
      ">
        <div className="
          flex gap-2 justify-around
        ">
          <Select
            value={launchpad?.id}
            onChange={handleLaunchpadSelection}

            placeholder="Select a launchpad"
            title="Select a launchpad"
          >
            {data.launchpads.map((launchpad, launchpadKey) =>
              <option value={launchpadKey} key={launchpadKey}>
                {launchpad.name}
              </option>
            )}
          </Select>

          <button
            className="
              whitespace-nowrap px-4 py-2 rounded-lg
              text-gray-300
              hover:bg-blue-600
              bg-gray-900 bg-opacity-20
              border border-gray-900 hover:border-blue-500
              transition-all
            "

            onClick={addLaunchpad}
            title="Add a launchpad to the project"
          >
            <HiOutlinePlus size={18} />
          </button>
        </div>

        {launchpad && (
          <Launchpad
            ref={launchpadRef}
            layout="programmer"
            onPadUp={() => null}
            onPadDown={pad_id => handleLaunchpadClick(pad_id)}
          />
        )}

        <div className="
          flex gap-2 justify-around
        ">
          {launchpad
            ? (
              <Fragment>
                <Input
                  placeholder={launchpad.name}
                  value={launchpad.name}
                  onChange={evt => {
                    const data_copy = { ...data };
                    data_copy.launchpads[launchpad.id].name = evt.target.value;
                    setData(data_copy);
                  }}
                />

                <button
                  className="
                    px-4 py-2 rounded-lg
                    text-gray-300 hover:text-pink-600
                    bg-gray-900 bg-opacity-20 hover:bg-opacity-60
                    border border-gray-900 hover:border-pink-600
                  "

                  onClick={removeLaunchpad}
                  title="Remove current launchpad"
                >
                  <HiOutlineTrash size={18} />
                </button>
              </Fragment>
            )
            : (
              <p className="
                text-gray-300
                px-4 py-2 rounded-lg
                bg-gray-900 bg-opacity-40
              ">
                No launchpad selected
              </p>
            )
          }
        </div>
      </div>
    </div>
  );
}
