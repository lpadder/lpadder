import type { ProjectData, ProjectDataSample } from "@/types/Project";
import type { ChangeEvent } from "react";

import { useRef, useEffect } from "react";
import logger from "@/utils/logger";

// Stores
import { useUnsavedProjectStore } from "@/stores/unsaved_project";

// Components
import Launchpad from "@/components/Launchpad";
import CardEditor from "./CardEditor";

interface LaunchpadEditorProps {
  setCurrentLaunchpadSelected: (id: number) => void;
  handleLaunchpadSelection: (evt: ChangeEvent<HTMLSelectElement>) => void,
  launchpad: ProjectData["launchpads"][number] & { id: number } | null,
  sample: ProjectDataSample & { id: number } | null,

  addLaunchpad: () => void,
  removeLaunchpad: () => void,

  handleLaunchpadClick: (pad_id: number) => void;
}

export default function LaunchpadEditor ({
  setCurrentLaunchpadSelected,
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

  /** Remove `1` to the launchpad index. */
  const upLaunchpad = () => {
    if (!launchpad) return;
    const data_copy = { ...data };
    const launchpads_copy = [...data_copy.launchpads];
    const launchpad_copy = { ...launchpads_copy[launchpad.id] };
    const launchpad_id = launchpad.id;

    if (launchpad_id === 0) return;

    launchpads_copy[launchpad_id] = launchpads_copy[launchpad_id - 1];
    launchpads_copy[launchpad_id - 1] = launchpad_copy;

    data_copy.launchpads = launchpads_copy;
    setData(data_copy);

    setCurrentLaunchpadSelected(launchpad_id - 1);
  };

  /** Add `1` to the launchpad index. */
  const downLaunchpad = () => {
    if (!launchpad) return;
    const data_copy = { ...data };
    const launchpads_copy = [...data_copy.launchpads];
    const launchpad_copy = { ...launchpads_copy[launchpad.id] };
    const launchpad_id = launchpad.id;

    if (launchpad_id === launchpads_copy.length - 1) return;

    launchpads_copy[launchpad_id] = launchpads_copy[launchpad_id + 1];
    launchpads_copy[launchpad_id + 1] = launchpad_copy;

    data_copy.launchpads = launchpads_copy;
    setData(data_copy);

    setCurrentLaunchpadSelected(launchpad_id + 1);
  };

  return (
    <CardEditor
      type="launchpad"
      launchpad={launchpad}
      target={launchpad}
    
      addToSelector={addLaunchpad}
      removeFromSelector={removeLaunchpad}

      selectorItems={data.launchpads}
      handleSelection={handleLaunchpadSelection}

      upItem={upLaunchpad}
      downItem={downLaunchpad}
    >

      {launchpad && (
        <Launchpad
          ref={launchpadRef}
          layout="programmer"
          onPadUp={() => null}
          onPadDown={pad_id => handleLaunchpadClick(pad_id)}
        />
      )}

    </CardEditor>
  );
}
