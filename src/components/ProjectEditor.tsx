import type { ProjectData } from "@/types/Project";

import {
  ChangeEvent, Fragment
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

  const handleLaunchpadClick = (pad_id: number) => {
    console.log("LP Click", launchpad, page, pad_id);
  };

  return (
    <div>
      <LaunchpadEditor
        currentLaunchpadPageSelected={currentLaunchpadPageSelected}
        handleLaunchpadSelection={handleLaunchpadSelection}
        launchpad={launchpad}

        addLaunchpad={addLaunchpad}
        removeLaunchpad={removeLaunchpad}

        handleLaunchpadClick={handleLaunchpadClick}
      />

      {/* <div className="
          flex gap-2 justify-around mb-4
        "> */}
      {/* <Select
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
        </button> */}
      {/* </div> */}

      

      {/* {launchpad && page && (
        <div>
          <h3>Page {page.name} from {launchpad.name}</h3>
        </div>
      )} */}
        
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


const LaunchpadEditor = ({
  launchpad,
  currentLaunchpadPageSelected,
  handleLaunchpadSelection,

  addLaunchpad,
  removeLaunchpad,

  handleLaunchpadClick
}: {
  launchpad: ProjectData["launchpads"][number] & { id: number } | null,
  currentLaunchpadPageSelected: number | undefined,
  handleLaunchpadSelection: (evt: ChangeEvent<HTMLSelectElement>) => void,
  
  addLaunchpad: () => void,
  removeLaunchpad: () => void,

  handleLaunchpadClick: (pad_id: number) => void;
})  => {
  const log = logger("/:slug~LaunchpadEditor");
  /** Debug. */ log.render();

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
              border border-gray-900 hover:border-blue-600
              transition-all
            "
            onClick={addLaunchpad}
          >
            <HiOutlinePlus size={18} />
          </button>
        </div>

        <Launchpad
          layout="programmer"
          onPadUp={() => null}
          onPadDown={pad_id => handleLaunchpadClick(pad_id)}
        />

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
      {/* /* <div className="
            flex flex-col gap-4 w-full
          ">
        <div className="
              flex gap-2 justify-around mb-4
            ">
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
        {page && (
          <Input
            labelName="Page name"
            placeholder={page.name}
            value={page.name}
            onChange={evt => {
              const data_copy = { ...data };
              data_copy.launchpads[launchpad.id].pages[page.id].name = evt.target.value;
              setData(data_copy);
            }}
          />
        )} */}
      {/* </div> */}
    </div>
  );

};