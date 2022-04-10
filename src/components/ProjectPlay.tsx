import type {
  ClickEventFunctionProps,
  ContextEventFunctionProps
} from "@/components/Launchpad";

import Launchpad from "@/components/Launchpad";
import { getHexFromVelocity } from "@/utils/novationPalette";
import { useEffect } from "react";

import {
  useCurrentProjectStore
} from "@/stores/projects";

export default function ProjectPlay () {
  const project = useCurrentProjectStore(state => state.currentProject);

  useEffect(() => {
    console.group("[ProjectPlay] Update on project data.");
    console.info("Re-rendering...");

    // TODO: Reload all the audio, etc... (when it will be supported).

    console.info("Done !");
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

  if (!project) return <p>Loading...</p>;

  return (
    <div>      
      <div
        className="flex flex-row gap-2 justify-center items-center w-full"
      >
        {project.data.launchpads.map((_, id) =>
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
        )}
      </div>
    </div>
  );
}
