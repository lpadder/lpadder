import type {
  ProjectDataSample
} from "@/types/Project";

import {
  ChangeEvent,
  useState
} from "react";

import logger from "@/utils/logger";

import { useUnsavedProjectStore } from "@/stores/unsaved_project";

// ProjectEditor's components
import LaunchpadEditor from "./LaunchpadEditor";
import LaunchpadPageEditor from "./LaunchpadPageEditor";

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

const PadEditor = ({ sample }: { sample: ProjectDataSample & { id: number } }) => {

  return (
    <div>
      <p>
        Viewing sample from note {sample.id}
      </p>
    </div>
  );
};