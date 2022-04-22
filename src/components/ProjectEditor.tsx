import type {
  ProjectData,
  ProjectDataSample
} from "@/types/Project";

import {
  ChangeEvent,
  Fragment,
  useState,
  useEffect,
  useRef
} from "react";

import logger from "@/utils/logger";

import {
  useUnsavedProjectStore
} from "@/stores/unsaved_project";

import Launchpad from "./Launchpad";
import Select from "./Select";
import Input from "./Input";

import { HiArrowDown, HiArrowUp, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

export default function ProjectEditor () {
  const log = logger("/:slug~ProjectEditor");
  /** Debug. */ log.render();

  const { data, setData } = useUnsavedProjectStore();
  if (!data) return <p>Loading...</p>;

  /** Index of the current used launchpad. */
  const initialLaunchpadId = (
    data.launchpads.length > 0
  ) ? 0 : undefined;

  /** Index of the current page used in current launchpad. */
  const initialLaunchpadPageId = (
    data.launchpads.length > 0
    && (data.launchpads[0].pages.length > 0)
  ) ? 0 : undefined;

  const [currentLaunchpadSelected, setCurrentLaunchpadSelected] = useState<number | undefined>(initialLaunchpadId);
  const handleLaunchpadSelection = (evt: ChangeEvent<HTMLSelectElement>) => {
    // Reset the page selector.
    setCurrentLaunchpadPageSelected(undefined);

    const index = evt.target.value;
    if (!index) {
      setCurrentLaunchpadSelected(undefined);
      return;
    }
    
    setCurrentLaunchpadSelected(parseInt(index));
    setCurrentPadSelected(undefined);
  };

  const [currentLaunchpadPageSelected, setCurrentLaunchpadPageSelected] = useState<number | undefined>(initialLaunchpadPageId);
  const handleLaunchpadPageSelection = (evt: ChangeEvent<HTMLSelectElement>) => {
    const index = evt.target.value;
    if (!index) {
      setCurrentLaunchpadPageSelected(undefined);
      return;
    }

    setCurrentLaunchpadPageSelected(parseInt(index));
    setCurrentPadSelected(undefined);
  };

  /** Add a new launchpad in the project. */
  const addLaunchpad = () => {
    const data_copy = { ...data };

    const index = data_copy.launchpads.length;
    const name = `Launchpad ${index}`;
    data_copy.launchpads.push({ name, pages: [] });
    
    setData(data_copy);
    setCurrentLaunchpadPageSelected(undefined);
    setCurrentPadSelected(undefined);
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
    setCurrentPadSelected(undefined);
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
    setCurrentPadSelected(undefined);
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
    setCurrentPadSelected(undefined);
    setCurrentLaunchpadPageSelected(page_to_use);
  };

  const [currentPadSelected, setCurrentPadSelected] = useState<number | undefined>(undefined);
  const handleLaunchpadClick = (pad_id: number) => {
    if (!page || !launchpad) return;

    console.log("Moving to", pad_id);
    setCurrentPadSelected(pad_id);
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

  const sample = (launchpad && page && typeof currentPadSelected !== "undefined") ? {
    ...page.samples[currentPadSelected],
    id: currentPadSelected
  } : null;

  return (
    <div>
      <div className="flex flex-row flex-wrap gap-4">
        <LaunchpadEditor
          handleLaunchpadSelection={handleLaunchpadSelection}
          launchpad={launchpad}
          sample={sample}

          addLaunchpad={addLaunchpad}
          removeLaunchpad={removeLaunchpad}

          handleLaunchpadClick={handleLaunchpadClick}
        />

        {launchpad && (
          <LaunchpadPageEditor
            setCurrentLaunchpadPageSelected={setCurrentLaunchpadPageSelected}
            handleLaunchpadPageSelection={handleLaunchpadPageSelection}
            launchpad={launchpad}
            page={page}
  
            addLaunchpadPage={addLaunchpadPage}
            removeLaunchpadPage={removeLaunchpadPage}
          />
        )}
      </div>

      {sample && (
        <PadEditor
          sample={sample}
        />
      )}
    </div>
  );
}

const LaunchpadEditor = ({
  handleLaunchpadSelection,
  launchpad,
  sample,

  addLaunchpad,
  removeLaunchpad,

  handleLaunchpadClick
}: {
  handleLaunchpadSelection: (evt: ChangeEvent<HTMLSelectElement>) => void,
  launchpad: ProjectData["launchpads"][number] & { id: number } | null,
  sample: ProjectDataSample & { id: number } | null,

  addLaunchpad: () => void,
  removeLaunchpad: () => void,

  handleLaunchpadClick: (pad_id: number) => void;
})  => {
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
};

const LaunchpadPageEditor = ({
  page,
  launchpad,
  handleLaunchpadPageSelection,
  setCurrentLaunchpadPageSelected,

  addLaunchpadPage,
  removeLaunchpadPage,
}: {
  page: ProjectData["launchpads"][number]["pages"][number] & { id: number } | null,
  launchpad: ProjectData["launchpads"][number] & { id: number },
  setCurrentLaunchpadPageSelected: (id: number) => void,
  handleLaunchpadPageSelection: (evt: ChangeEvent<HTMLSelectElement>) => void,

  addLaunchpadPage: () => void,
  removeLaunchpadPage: () => void
}) => {
  const log = logger("/:slug~LaunchpadPageEditor");
  /** Debug. */ log.render();

  const { data, setData } = useUnsavedProjectStore();
  if (!data) return <p>Loading...</p>;

  /** Remove 1 to the page index.  */
  const upLaunchpadPage = () => {
    if (!page) return;
    const data_copy = { ...data };
    const launchpad_copy = { ...data_copy.launchpads[launchpad.id] };
    const pages_copy = [...launchpad_copy.pages];
    const page_copy = { ...pages_copy[page.id] };
    const page_id = page.id;

    if (page_id === 0) return;

    pages_copy[page_id] = pages_copy[page_id - 1];
    pages_copy[page_id - 1] = page_copy;

    launchpad_copy.pages = pages_copy;
    data_copy.launchpads[launchpad.id] = launchpad_copy;
    setData(data_copy);

    setCurrentLaunchpadPageSelected(page_id - 1);
  };

  const downLaunchpadPage = () => {
    if (!page) return;
    const data_copy = { ...data };
    const launchpad_copy = { ...data_copy.launchpads[launchpad.id] };
    const pages_copy = [...launchpad_copy.pages];
    const page_copy = { ...pages_copy[page.id] };
    const page_id = page.id;

    if (page_id === pages_copy.length - 1) return;

    pages_copy[page_id] = pages_copy[page_id + 1];
    pages_copy[page_id + 1] = page_copy;

    launchpad_copy.pages = pages_copy;
    data_copy.launchpads[launchpad.id] = launchpad_copy;
    setData(data_copy);

    setCurrentLaunchpadPageSelected(page_id + 1);
  };

  return (
    <div className="
      flex flex-col sm:flex-row gap-4 p-4
      bg-gray-700 rounded-lg w-fit mx-auto
    ">
      <div className="
        h-full max-w-xs sm:w-60 md:w-64 m-auto flex flex-col gap-4
      ">
        <div className="
          flex gap-2
        ">
          <Select
            value={page?.id}
            onChange={handleLaunchpadPageSelection}
            placeholder="Select a page"
          >
            {launchpad?.pages.map((page, pageKey) =>
              <option value={pageKey} key={pageKey}>
                {page.name}
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
            onClick={addLaunchpadPage}
          >
            <HiOutlinePlus size={18} />
          </button>
        </div>

        <div className="
          flex gap-2 justify-around
        ">
          {page
            ? (
              <Fragment>
                {page.id !== 0 && (
                  <button
                    className="
                    px-4 py-2 rounded-lg w-full flex justify-center
                    text-gray-300 hover:text-blue-600
                    bg-gray-900 bg-opacity-20 hover:bg-opacity-60
                    border border-gray-900 hover:border-blue-600
                  "
                    onClick={upLaunchpadPage}
                  >
                    <HiArrowUp size={18} />
                  </button>
                )}

                <button
                  className="
                  px-4 py-2 rounded-lg w-full flex justify-center
                  text-gray-300 hover:text-pink-600
                  bg-gray-900 bg-opacity-20 hover:bg-opacity-60
                  border border-gray-900 hover:border-pink-600
                "
                  onClick={removeLaunchpadPage}
                >
                  <HiOutlineTrash size={18} />
                </button>

                {page.id !== (launchpad.pages.length - 1) && (
                  <button
                    className="
                    px-4 py-2 rounded-lg w-full flex justify-center
                    text-gray-300 hover:text-blue-600
                    bg-gray-900 bg-opacity-20 hover:bg-opacity-60
                    border border-gray-900 hover:border-blue-600
                  "
                    onClick={downLaunchpadPage}
                  >
                    <HiArrowDown size={18} />
                  </button>
                )}
              </Fragment>
            )
            : (
              <p className="
                text-gray-300
                px-4 py-2 rounded-lg
                bg-gray-900 bg-opacity-40
                h-fit my-auto
              ">
                No page selected
              </p>
            )
          }
        </div>


        {page && (
          <Input
            placeholder={page.name}
            value={page.name}
            onChange={evt => {
              const data_copy = { ...data };
              data_copy.launchpads[launchpad.id].pages[page.id].name = evt.target.value;
              setData(data_copy);
            }}
          />
        )}
      </div>
    </div>
  );
};

const PadEditor = ({ sample }: { sample: ProjectDataSample & { id: number } }) => {

  return (
    <div>
      <p>
        Viewing sample from note {sample.id}
      </p>
    </div>
  );
};