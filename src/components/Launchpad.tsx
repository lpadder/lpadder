import type { AvailableLayouts } from "../utils/LaunchpadLayout";
import LaunchpadLayout from "../utils/LaunchpadLayout";

export function getPadElementId (padId: number, launchpadId = 0) {
  const elementId = `launchpad-${launchpadId}-pad-${padId}`;
  return elementId;
}

export type ClickEventFunctionProps = (
  padId: number,
  launchpadId: number,
  padElement: EventTarget & HTMLDivElement
) => void;
  
export type ContextEventFunctionProps = (
  padId: number,
  launchpadId: number,
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => void;

type LaunchpadProps = {
  launchpadId?: number;
  layout?: AvailableLayouts;

  /** Events that can be triggered. */
  onPadDown: ClickEventFunctionProps;
  onPadUp: ClickEventFunctionProps;

  /** Optional ustom behaviour on right click. */
  onContextMenu?: ContextEventFunctionProps;
}

/**
 * We create a new launchpad with the given layout.
 * 'launchpadId' is used when using multiples launchpad
 * on the same page. We will use it in the HTML "id" to
 * access the pad later.
 */
export default function Launchpad ({
  launchpadId = 0,
  layout = "live",
  onPadDown,
  onPadUp,
  onContextMenu
}: LaunchpadProps) {
  const launchpadLayouts = new LaunchpadLayout();
  const currentLayout = launchpadLayouts.layouts[layout];

  console.log("Render launchpad");

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
              key={padId}
              id={getPadElementId(padId, launchpadId)}
              onContextMenu={(event) => {
                // We prevent the context menu.
                event.preventDefault();

                // Execute the custom behaviour if it exists.
                if (!onContextMenu) return;
                return onContextMenu(padId, launchpadId, event);
              }}
              onTouchStart={(event) => {
                // By stopping propagation, we suppress
                // the 'onMouseDown' event.
                event.stopPropagation();

                /** Debug. */ console.info(
                  "[Launchpad][onTouchStart] (DOWN ↓): Pad", padId,
                  "from Launchpad", launchpadId + "."
                );

                // We save the target pad HTML element.
                const padElement = event.currentTarget;

                const handleTouchEnd = (up_event: TouchEvent) => {
                  up_event.preventDefault();

                  /** Debug. */ console.info(
                    "[Launchpad][handleTouchEnd] (UP ↑): Pad", padId,
                    "from Launchpad", launchpadId + "."
                  );

                  onPadUp(padId, launchpadId, padElement);
                  document.removeEventListener("touchend", handleTouchEnd);
                };

                onPadDown(padId, launchpadId, padElement);
                document.addEventListener("touchend", handleTouchEnd);
              }}
              onMouseDown={(event) => {
                if (event.button === 2) return;

                /** Debug. */ console.info(
                  "[Launchpad][onMouseDown] (DOWN ↓): Pad", padId,
                  "from Launchpad", launchpadId + "."
                );

                // We save the target pad HTML element.
                const padElement = event.currentTarget;

                const handleMouseUp = (up_event: MouseEvent) => {
                  if (up_event.button === 2) return;

                  /** Debug. */ console.info(
                    "[Launchpad][handleMouseUp] (UP ↑): Pad", padId,
                    "from Launchpad", launchpadId + "."
                  );

                  onPadUp(padId, launchpadId, padElement);
                  document.removeEventListener("mouseup", handleMouseUp);
                };

                onPadDown(padId, launchpadId, padElement);
                document.addEventListener("mouseup", handleMouseUp);
              }}
              className="w-full bg-gray-400 rounded-sm select-none aspect-square"
            />
          ))}
        </div>
      ))}
    </div>
  );
}