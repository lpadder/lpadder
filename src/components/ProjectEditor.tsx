import type {
  ProjectStructure
} from "@/types/Project";

import { useLocalProjectStore } from "@/pages/projects/slug";

import { ChangeEvent, useEffect, useState } from "react";

type ProjectEditorProps = {
  saveProjectLocally: (data: ProjectStructure) => void;
};

export default function ProjectEditor ({
  saveProjectLocally
}: ProjectEditorProps) {
  const data = useLocalProjectStore(
    state => state.projectLocalData
  );

  useEffect(() => {
    console.info("[ProjectEditor] Loading project editor...");

    // TODO: Load modules and components...

    console.info("[ProjectEditor] Done !");
  }, []);

  if (!data) return <p>Loading...</p>;

  /** Index of the current used launchpad. */
  const [currentLaunchpadSelected, setCurrentLaunchpadSelected] = useState<number | null>(null);
  const handleLaunchpadSelection = (evt: ChangeEvent<HTMLSelectElement>) => {
    const index = evt.target.value;
    if (index === "none") {
      setCurrentLaunchpadSelected(null);
      return;
    }

    setCurrentLaunchpadSelected(parseInt(index));
  };

  const addLaunchpad = () => {
    const data_copy = { ...data };

    const index = data_copy.launchpads.length + 1;
    const name = `Launchpad ${index}`;
    data_copy.launchpads.push({ name, pages: [] });
    
    saveProjectLocally(data_copy);
  };

  const removeLaunchpad = () => {
    const data_copy = { ...data };

    // Remove launchpad using current index.
    data_copy.launchpads = data_copy.launchpads.filter(
      (_, index) => index !== currentLaunchpadSelected
    );

    console.log(data_copy);
    saveProjectLocally(data_copy);
  };

  return (
    <div>
      <div>
        <h3>Launchpads</h3>

        <select
          onChange={handleLaunchpadSelection}
          placeholder="Select a launchpad"
        >
          <option value="none">None</option>
          {data.launchpads.map((launchpad, launchpadKey) =>
            <option value={launchpadKey} key={launchpadKey}>
              Launchpad {launchpadKey}
            </option>
          )}
        </select>

        <button onClick={addLaunchpad}>
          Add a launchpad
        </button>

        {currentLaunchpadSelected !== null && data.launchpads[currentLaunchpadSelected] &&
          <div>
            <button onClick={removeLaunchpad}>
              Remove this launchpad
            </button>
          </div>
        }
        
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
    </div>
  );
}
