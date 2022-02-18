import type {
  ProjectStructure
} from "@/types/Project";

import type {
  ClickEventFunctionProps,
  ContextEventFunctionProps
} from "@/components/Launchpad";

import { useLocalProjectStore } from "@/pages/projects/slug";

import Launchpad from "@/components/Launchpad";
import { getHexFromVelocity } from "@/utils/novationPalette";
import { useEffect } from "react";

type ProjectPlayProps = {
  saveProjectLocally: (data: ProjectStructure) => void;
};

export default function ProjectPlay ({
  saveProjectLocally
}: ProjectPlayProps) {
  const data = useLocalProjectStore(state => state.projectLocalData);

  useEffect(() => {
    console.group("[ProjectPlay][useEffect]");
    console.info("Got 'projectLocalData' from local state !", data);
    console.groupEnd();
  }, []);
  
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

  if (!data) return <p>Loading...</p>;

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