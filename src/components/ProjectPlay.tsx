import type {
  ClickEventFunctionProps
} from "@/components/Launchpad";

import Launchpad from "@/components/Launchpad";
import { getHexFromVelocity } from "@/utils/novationPalette";
import logger from "@/utils/logger";

import {
  useCurrentProjectStore
} from "@/stores/current_project";

export default function ProjectPlay () {
  const project = useCurrentProjectStore(state => state.data);
  
  const log = logger("/:slug~ProjectPlay");
  /** Debug. */ log.render();

  const handlePadDown: ClickEventFunctionProps = (_padId, padElement) => {
    padElement.style.backgroundColor = getHexFromVelocity(3);
  };
  
  const handlePadUp: ClickEventFunctionProps = (_padId, padElement) => {
    // Remove every styling applied to the pad.
    padElement.removeAttribute("style");
  };

  if (!project) return (
    <p>Loading project data...</p>
  );

  return (
    <div className="
      w-full bg-gray-700 bg-opacity-60 h-64 p-6 mb-6
      rounded-lg overflow-y-auto
    "> 
      <div className="
        flex justify-start items-center 
        w-fit h-full gap-2
      ">
        {project.launchpads.map((_, launchpadId) =>
          <div
            key={launchpadId}
            className="flex gap-2 items-start flex-row h-full"
          >
            <div
              className="h-full w-full aspect-square"
            >
              <Launchpad
                launchpadId={launchpadId}
                layout="programmer"
                onPadDown={handlePadDown}
                onPadUp={handlePadUp}
              />
            </div>
            <button className="rounded-full bg-gray-600 p-2"></button>
          </div>
        )}
      </div>
    </div>
  );
}
