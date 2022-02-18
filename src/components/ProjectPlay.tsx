import type {
  ProjectStructure
} from "@/types/Project";

import type {
  ClickEventFunctionProps,
  ContextEventFunctionProps
} from "@/components/Launchpad";

import DropdownButton from "./DropdownButton";

import Launchpad from "@/components/Launchpad";
import { getHexFromVelocity } from "@/utils/novationPalette";

type ProjectPlayProps = {
  data: ProjectStructure;
  saveProjectLocally: (data: ProjectStructure) => void;
  saveProjectGlobally: (data: ProjectStructure) => Promise<void>;
};

export default function ProjectPlay ({
  data, 
  saveProjectLocally, saveProjectGlobally
}: ProjectPlayProps) {
  console.info("[ProjectPlay] 'data' from render:", data);

  const handlePadDown: ClickEventFunctionProps = (padId, launchpadId, padElement) => {
    padElement.style.backgroundColor = getHexFromVelocity(3);
  };
  
  const handlePadUp: ClickEventFunctionProps = (padId, launchpadId, padElement) => {
    // Remove every styling applied to the pad.
    padElement.removeAttribute("style");
  };

  const handleContextMenu: ContextEventFunctionProps = (padId, launchpadId, event) => {
    console.log(event.currentTarget);
  };

  return (
    <div>      
      <div
        className="flex flex-row gap-2 justify-center items-center w-full"
      >
        {data.launchpads.length > 0
          ? data.launchpads.map((_, id) =>
            <div
              key={id}
              className="w-64 h-64"
            >
              <Launchpad
                launchpadId={id}
                layout="programmer"
                onPadDown={handlePadDown}
                onPadUp={handlePadUp}

                onContextMenu={handleContextMenu}
              />
            </div>
          )
          : <button
            onClick={() => {
              const newData = {
                ...data,
                launchpads: [...data.launchpads, []]
              };

              saveProjectLocally({ ...newData });
            }}
            className="px-4 py-2 bg-blue-600 rounded-full"
          >
            Add a launchpad
          </button>
        }
      </div>
    </div>
  );
}