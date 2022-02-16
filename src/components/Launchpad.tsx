import type { AvailableLayouts } from "../utils/LaunchpadLayout";
import LaunchpadLayout from "../utils/LaunchpadLayout";

export type LaunchpadProps = {
  launchpadId?: number;
  layout?: AvailableLayouts;
  onClick: (padId: number, launchpadId: number) => void;
}

/**
 * We create a new launchpad with the given layout.
 * 'launchpadId' is used when using multiples launchpad
 * on the same page. We will use it in the HTML "id" to
 * access the pad later.
 * 
 * 'onClick' is a function that takes two parameters (padId, launchpadId)
 * and will be triggered on pad onClick.
 */
export default function Launchpad ({
  launchpadId = 0,
  layout = "live",
  onClick
}: LaunchpadProps) {
  const launchpadLayouts = new LaunchpadLayout();
  const currentLayout = launchpadLayouts.layouts[layout];

  return (
    <div
      className="flex flex-col gap-1"
    >
      {currentLayout.map((rows, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-row gap-1"
        >
          {rows.map(padId => (
            <div
              id={`launchpad-${launchpadId}-pad-${padId}`}
              key={padId}
              onContextMenu={(e) => e.preventDefault()}
              onMouseDown={() => onClick(padId, launchpadId)}
              className="w-full bg-gray-400 rounded-sm select-none aspect-square"
            />
          ))}
        </div>
      ))}
    </div>
  );
}