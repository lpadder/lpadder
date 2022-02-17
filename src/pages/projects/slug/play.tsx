import type {
  ProjectStructure
} from "@/types/Project";

import type {
  ClickEventFunctionProps
} from "@/components/Launchpad";

import Launchpad from "@/components/Launchpad";
import { getHexFromVelocity } from "@/utils/novationPalette";

type ProjectPlayProps = {
  data: ProjectStructure;
  saveProjectLocally: (data: ProjectStructure) => Promise<{
    slug: string;
    project: ProjectStructure;
  } | undefined>;
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

  return (
    <div>
      <h1>Play</h1>
      
      <div
        className="flex flex-row gap-2 justify-center items-center w-full"
      >
        <div
          className="w-64 h-64"
        >
          <Launchpad
            layout="programmer"
            onPadDown={handlePadDown}
            onPadUp={handlePadUp}
          />
        </div>
        <div
          className="w-64 h-64"
        >
          <Launchpad
            launchpadId={1}
            layout="programmer"
            onPadDown={handlePadDown}
            onPadUp={handlePadUp}
          />
        </div>
      </div>
    </div>
  );
}