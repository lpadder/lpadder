import type {
  ChangeEvent
} from "react";

import {
  useState
} from "react";

import logger from "@/utils/logger";

import {
  useUnsavedProjectStore
} from "@/stores/unsaved_project";

import Launchpad from "./Launchpad";
import Select from "./Select";
import Input from "./Input";

import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

export default function ProjectEditor () {
  const log = logger("/:slug~ProjectEditor");
  /** Debug. */ log.render();

  const { data, setData } = useUnsavedProjectStore();
  if (!data) return <p>Loading...</p>;

  /** Index of the current used launchpad. */
  const [currentLaunchpadSelected, setCurrentLaunchpadSelected] = useState<number | undefined>(data.launchpads.length > 0 ? 0 : undefined);
  const handleLaunchpadSelection = (evt: ChangeEvent<HTMLSelectElement>) => {
    // Reset the page selector.
    setCurrentLaunchpadPageSelected(undefined);

    const index = evt.target.value;
    if (!index) {
      setCurrentLaunchpadSelected(undefined);
      return;
    }
    
    setCurrentLaunchpadSelected(parseInt(index));
  };
  
  /** Index of the current page used in current launchpad. */
  const [currentLaunchpadPageSelected, setCurrentLaunchpadPageSelected] = useState<number | undefined>(currentLaunchpadSelected && data.launchpads[currentLaunchpadSelected].pages.length > 0 ? 0 : undefined);
  const handleLaunchpadPageSelection = (evt: ChangeEvent<HTMLSelectElement>) => {
    const index = evt.target.value;
    if (!index) {
      setCurrentLaunchpadPageSelected(undefined);
      return;
    }

    setCurrentLaunchpadPageSelected(parseInt(index));
  };

  /** Add a new launchpad in the project. */
  const addLaunchpad = () => {
    const data_copy = { ...data };

    const index = data_copy.launchpads.length;
    const name = `Launchpad ${index}`;
    data_copy.launchpads.push({ name, pages: [] });
    
    setData(data_copy);
    setCurrentLaunchpadPageSelected(undefined);
    setCurrentLaunchpadSelected(index);
  };

  /** Remove the current selected launchpad with all of its page. */
  const removeLaunchpad = () => {
    if (typeof currentLaunchpadSelected === "undefined") return;
    const data_copy = { ...data };

    // Remove launchpad using current index.
    data_copy.launchpads = data_copy.launchpads.filter(
      (_, index) => index !== currentLaunchpadSelected
    );

    /**
     * We select the launchpad before the current one.
     * If there's no launchpad before, we select the first one.
     * If there's no launchpad at all, we select nothing.
     */
    const launchpad_to_use = data_copy.launchpads[currentLaunchpadSelected - 1]
      ? currentLaunchpadSelected - 1
      : data_copy.launchpads.length > 0 ? 0 : undefined; 

    setData(data_copy);
    setCurrentLaunchpadSelected(launchpad_to_use);
  };

  /** Add a new page to the current selected launchpad. */
  const addLaunchpadPage = () => {
    if (typeof currentLaunchpadSelected === "undefined") return;
    const data_copy = { ...data };

    // Add a new page to the current launchpad.
    const index = data_copy.launchpads[currentLaunchpadSelected].pages.length;
    const name = `Page ${index}`;
    data_copy.launchpads[currentLaunchpadSelected].pages.push({ name, samples: [] });
    setData(data_copy);
    setCurrentLaunchpadPageSelected(index);
  };

  const removeLaunchpadPage = () => {
    if (typeof currentLaunchpadSelected === "undefined") return;
    if (typeof currentLaunchpadPageSelected === "undefined") return;
    const data_copy = { ...data };

    // Remove launchpad page using current index.
    data_copy.launchpads[currentLaunchpadSelected].pages = data_copy.launchpads[currentLaunchpadSelected].pages.filter(
      (_, index) => index !== currentLaunchpadPageSelected
    );

    /**
     * We select the page before the current one.
     * If there's no page before, we select the first one.
     * If there's no page at all, we select nothing.
     */
    const page_to_use = data_copy.launchpads[currentLaunchpadSelected].pages[currentLaunchpadPageSelected - 1]
      ? currentLaunchpadPageSelected - 1
      : data_copy.launchpads[currentLaunchpadSelected].pages.length > 0 ? 0 : undefined; 

    setData(data_copy);
    setCurrentLaunchpadPageSelected(page_to_use);
  };

  // Short-hands for the current launchpad and page.
  // We append the current index in the objects to avoid
  // having to always re-use `(currentLaunchpadSelected !== null)`, etc...
  const launchpad = (typeof currentLaunchpadSelected !== "undefined") ? {
    ...data.launchpads[currentLaunchpadSelected],
    id: currentLaunchpadSelected
  } : null;
  const page = (launchpad && typeof currentLaunchpadPageSelected !== "undefined") ? {
    ...launchpad.pages[currentLaunchpadPageSelected],
    id: currentLaunchpadPageSelected
  } : null;

  return (
    <div>
      <div className="
          flex gap-2 justify-around mb-4
        ">
        <Select
          value={currentLaunchpadSelected}
          onChange={handleLaunchpadSelection}
          placeholder="Select a launchpad"
        >
          {data.launchpads.map((launchpad, launchpadKey) =>
            <option value={launchpadKey} key={launchpadKey}>
              {launchpad.name}
            </option>
          )}
        </Select>
        {launchpad && (
          <button
            className="
              px-4 py-2 rounded-lg
              text-gray-300 hover:text-pink-600
               bg-gray-900 bg-opacity-20 hover:bg-opacity-60
              border border-gray-900 hover:border-pink-600
            "
            onClick={removeLaunchpad}
          >
            <HiOutlineTrash size={18} />
          </button>
        )}
        <button
          className="
              whitespace-nowrap px-4 py-2 rounded-lg
              text-gray-300
              hover:bg-blue-600
              bg-gray-900 bg-opacity-20
              border border-gray-900 hover:border-blue-600
              transition-all
            "
          onClick={addLaunchpad}
        >
          <HiOutlinePlus size={18} />
        </button>
      </div>

      {launchpad &&
        <div className="
          flex flex-col sm:flex-row gap-4
        ">
          <div className="
            w-64 mx-auto
          ">
            <Launchpad
              layout="programmer"
              onPadUp={() => null}
              onPadDown={() => null}
            />
          </div>
          <div className="
            flex flex-col gap-4
          ">
            <Input
              labelName="Launchpad name"
              placeholder={launchpad.name}
              value={launchpad.name}
              onChange={evt => {
                const data_copy = { ...data };
                data_copy.launchpads[launchpad.id].name = evt.target.value;
                setData(data_copy);
              }}
            />

            <div>
              <Select
                placeholder="Select a page"
                value={currentLaunchpadPageSelected}
                onChange={handleLaunchpadPageSelection}
              >
                {data.launchpads[launchpad.id].pages.map((page, pageKey) =>
                  <option value={pageKey} key={pageKey}>
                    {page.name}
                  </option>
                )}
              </Select>

              {page && (
                <button
                  className="
                    px-4 py-2 rounded-lg
                    text-gray-300 hover:text-pink-600
                    bg-gray-900 bg-opacity-20 hover:bg-opacity-60
                    border border-gray-900 hover:border-pink-600
                  "
                  onClick={removeLaunchpadPage}
                >
                  <HiOutlineTrash size={18} />
                </button>
              )}
              <button
                className="
                  whitespace-nowrap px-4 py-2 rounded-lg
                  text-gray-300
                  hover:bg-blue-600
                  bg-gray-900 bg-opacity-20
                  border border-gray-900 hover:border-blue-600
                  transition-all
                "
                onClick={addLaunchpadPage}
              >
                <HiOutlinePlus size={18} />
              </button>
            </div>
          </div>
        </div>
      }

      {launchpad && page && (
        <div>
          <h3>Page {page.name} from {launchpad.name}</h3>
        </div>
      )}
        
      {/*
          Idea: 
Launchpad: [input:number=1]
Page:      [input:number=4] 

(launchpad-(id) from page (page))
=> when clicking on buttons it shows the details about it

(if(button_clicked)
  (button (id) detail)
  triggers: nothing
  | triggers: { sample: wave_id }

  if (triggers.sample)
    (waveform with highlighted part)
)
        */}
    </div>
  );
}
