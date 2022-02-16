import type {
  ProjectStructure
} from "@/types/Project";

import Launchpad from "@/components/Launchpad";
import { getHexFromVelocity } from "@/utils/novationPalette";

type ProjectPlayProps = { data: ProjectStructure };
export default function ProjectPlay({ data }: ProjectPlayProps) {

  const padClickHandler = (padId: number, launchpadId: number) => {
    const padHtmlId = `launchpad-${launchpadId}-pad-${padId}`;
    const padHtmlElement = document.getElementById(padHtmlId);

    if (!padHtmlElement) return;

    padHtmlElement.style.backgroundColor = getHexFromVelocity(3);
    setTimeout(() => {
      padHtmlElement.style.backgroundColor = "";
    }, 500);

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
            onClick={padClickHandler}
          />
        </div>
        <div
          className="w-64 h-64"
        >
          <Launchpad
            launchpadId={1}
            layout="programmer"
            onClick={padClickHandler}
          />
        </div>
      </div>
    </div>
  );
}