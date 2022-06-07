import { Show } from { } from "solid-js";

import logger from "@/utils/logger";

import { useUnsavedProjectStore } from "@/stores/unsaved_project";

// ProjectEditor's components
import LaunchpadEditor from "./LaunchpadEditor";
import LaunchpadPageEditor from "./LaunchpadPageEditor";
import LaunchpadSampleEditor from "./LaunchpadSampleEditor";

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
  const handleLaunchpadSelection = (evt: InputEvent) => {
    const index = evt.target.value;
    if (!index) {
      setCurrentLaunchpadPageSelected(undefined);
      setCurrentLaunchpadSelected(undefined);
      return;
    }

    const launchpad_index_selected = parseInt(index);
    const launchpad_inital_page_index = (
      data.launchpads[launchpad_index_selected].pages.length > 0
    ) ? 0 : undefined;
    
    setCurrentLaunchpadSelected(launchpad_index_selected);
    setCurrentLaunchpadPageSelected(launchpad_inital_page_index);
    setCurrentPadSelected(undefined);
  };

  const [currentLaunchpadPageSelected, setCurrentLaunchpadPageSelected] = useState<number | undefined>(initialLaunchpadPageId);
  const handleLaunchpadPageSelection = (evt: ChangeEvent<HTMLSelectElement>) => {
    setCurrentPadSelected(undefined);

    const index = evt.target.value;
    if (!index) {
      setCurrentLaunchpadPageSelected(undefined);
      return;
    }

    const launchpad_page_index_selected = parseInt(index);
    setCurrentLaunchpadPageSelected(launchpad_page_index_selected);
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
    data_copy.launchpads[currentLaunchpadSelected].pages.push({ name, samples: {} });
    
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

  /** Short-hand for `currentLaunchpadSelected` with data. */
  const launchpad = (typeof currentLaunchpadSelected !== "undefined") ? {
    ...data.launchpads[currentLaunchpadSelected],
    id: currentLaunchpadSelected
  } : null;
  
  /** Short-hand for `currentLaunchpadPageSelected` with data. */
  const page = (launchpad && typeof currentLaunchpadPageSelected !== "undefined") ? {
    ...launchpad.pages[currentLaunchpadPageSelected],
    id: currentLaunchpadPageSelected
  } : null;
  
  /** Short-hand for `currentPadSelected` with data. */
  const sample = (launchpad && page && typeof currentPadSelected !== "undefined") ? {
    ...page.samples[currentPadSelected],
    id: currentPadSelected,
    isAssigned: !! page.samples[currentPadSelected]
  } : null;

  return (
    <div>
      <div class="flex flex-row flex-wrap gap-4 mb-4">
        <LaunchpadEditor
          setCurrentLaunchpadSelected={setCurrentLaunchpadSelected}
          handleLaunchpadSelection={handleLaunchpadSelection}
          launchpad={launchpad}
          sample={sample}

          addLaunchpad={addLaunchpad}
          removeLaunchpad={removeLaunchpad}

          handleLaunchpadClick={handleLaunchpadClick}
        />

        {<Show when={launchpad}>{<LaunchpadPageEditor
          setCurrentLaunchpadPageSelected={setCurrentLaunchpadPageSelected}
          handleLaunchpadPageSelection={handleLaunchpadPageSelection}
          launchpad={launchpad}
          page={page}
  
          addLaunchpadPage={addLaunchpadPage}
          removeLaunchpadPage={removeLaunchpadPage}
        />}</Show>}
      </div>

      {<Show when={launchpad && sample && page}>{<LaunchpadSampleEditor
        page={page}
        sample={sample}
        launchpad={launchpad}
      />}</Show>}
    </div>
  );
}

