import type { AvailableLayouts } from "../utils/LaunchpadLayout";
import LaunchpadLayout from "../utils/LaunchpadLayout";

import logger from "@/utils/logger";
import { forwardRef } from "react";

export function getPadElementId (padId: number, launchpadId = 0) {
  const elementId = `launchpad-${launchpadId}-pad-${padId}`;
  return elementId;
}

export type ClickEventFunctionProps = (
  padId: number,
  padElement: EventTarget & HTMLDivElement,
  launchpadId?: number,
) => void;
  
export type ContextEventFunctionProps = (
  padId: number,
  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  launchpadId?: number
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
function LaunchpadRaw ({
  launchpadId,
  layout = "live",
  onPadDown,
  onPadUp,
  onContextMenu
}: LaunchpadProps, ref: React.Ref<HTMLDivElement>) {
  const launchpadLayouts = new LaunchpadLayout();
  const currentLayout = launchpadLayouts.layouts[layout];

  const log = logger("~Launchpad");
  /** Debug. */ log.render();

  return (
    <div
      ref={ref}
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
              data-note={padId}
              id={launchpadId ? getPadElementId(padId, launchpadId) : undefined}
              
              onContextMenu={event => {
                event.preventDefault();

                // Execute the custom behaviour if it exists.
                if (!onContextMenu) return;
                return onContextMenu(padId, event, launchpadId);
              }}

              onTouchStart={down_event => {
                /**
                 * By stopping propagation, we suppress
                 * the `onMouseDown` event.
                 */
                down_event.stopPropagation();

                // We save the target pad HTML element.
                const pad = down_event.currentTarget;

                const handleTouchEnd = (up_event: TouchEvent) => {
                  up_event.preventDefault();

                  onPadUp(padId, pad, launchpadId);
                  document.removeEventListener("touchend", handleTouchEnd);
                };

                onPadDown(padId, pad, launchpadId);
                document.addEventListener("touchend", handleTouchEnd);
              }}
              
              onMouseDown={down_event => {
                if (down_event.button === 2) return;

                // We save the target pad HTML element.
                const pad = down_event.currentTarget;

                const handleMouseUp = (up_event: MouseEvent) => {
                  if (up_event.button === 2) return;

                  onPadUp(padId, pad, launchpadId);
                  document.removeEventListener("mouseup", handleMouseUp);
                };

                onPadDown(padId, pad, launchpadId);
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

const Launchpad = forwardRef<HTMLDivElement, LaunchpadProps>(LaunchpadRaw); 
export default Launchpad;