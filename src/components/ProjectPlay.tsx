import type {
  ClickEventFunctionProps,
  ContextEventFunctionProps
} from "@/components/Launchpad";

import Launchpad from "@/components/Launchpad";
import { getHexFromVelocity } from "@/utils/novationPalette";
import { useEffect, useState } from "react";

import {
  useCurrentProjectStore
} from "@/stores/projects";

export default function ProjectPlay () {
  const project = useCurrentProjectStore(state => state.currentProject);
  const [isRendering, setIsRendering] = useState(true);

  useEffect(() => {
    console.group("[ProjectPlay] Update on project data.");
    setIsRendering(true);
    console.info("Re-rendering...");

    // TODO: Reload all the audio, etc... (when it will be supported).

    console.info("Done !");
    setIsRendering(false);
    console.groupEnd();
  }, [project]);
  
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

  if (isRendering) return (
    <div>
      <p>Rendering new configuration...</p>
    </div>
  );

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
        {project.data.launchpads.map((_, id) =>
          <div
            key={id}
            className="h-full w-auto aspect-square"
          >
            <Launchpad
              launchpadId={id}
              layout="programmer"
              onPadDown={handlePadDown}
              onPadUp={handlePadUp}

              onContextMenu={handleContextMenu}
            />
          </div>
        )}
      </div>
    </div>
  );
}
