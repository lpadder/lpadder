import type {
  ProjectStructure
} from "@/types/Project";

import type {
  ClickEventFunctionProps
} from "@/components/Launchpad";

import Launchpad from "@/components/Launchpad";
import { getHexFromVelocity } from "@/utils/novationPalette";

type ProjectPlayProps = { data: ProjectStructure };
export default function ProjectPlay({ data }: ProjectPlayProps) {
  console.info("[ProjectPlay] 'data' from render:", data);

  const handlePadMouseDown: ClickEventFunctionProps = (padId, launchpadId, padElement) => {
    /** Debug. */ console.info(
      "[handlePadMouseDown] + (down) on pad", padId, "from launchpad", launchpadId
    );

    padElement.style.backgroundColor = getHexFromVelocity(3);
  };
  
  const handlePadMouseUp: ClickEventFunctionProps = (padId, launchpadId, padElement) => {
    /** Debug. */ console.info(
      "[handlePadMouseUp] - (up) on pad", padId, "from launchpad", launchpadId
    );

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
            onMouseUp={handlePadMouseUp}
            onMouseDown={handlePadMouseDown}
          />
        </div>
        <div
          className="w-64 h-64"
        >
          <Launchpad
            launchpadId={1}
            layout="programmer"
            onMouseUp={handlePadMouseUp}
            onMouseDown={handlePadMouseDown}
          />
        </div>
      </div>
    </div>
  );
}