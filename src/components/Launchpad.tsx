import type { Component } from "solid-js";

import type { AvailableLayouts } from "@/utils/LaunchpadLayout";
import LaunchpadLayout from "@/utils/LaunchpadLayout";

import { For } from "solid-js";

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
  event: MouseEvent & {
    currentTarget: HTMLDivElement;
    target: Element;
  },
  launchpadId?: number
) => void;

/**
 * We create a new launchpad with the given layout.
 * 'launchpadId' is used when using multiples launchpad
 * on the same page. We will use it in the HTML "id" to
 * access the pad later.
 */
const Launchpad: Component<{
  ref?: HTMLDivElement;
  launchpadId?: number;
  layout?: AvailableLayouts;

  /** Events that can be triggered. */
  onPadDown: ClickEventFunctionProps;
  onPadUp: ClickEventFunctionProps;

  /** Optional ustom behaviour on right click. */
  onContextMenu?: ContextEventFunctionProps;
}> = (props) => {
  const { layouts } = new LaunchpadLayout();

  const layout = () => props.layout || "programmer";
  const currentLayout = layouts[layout()];

  return (
    <div
      ref={props.ref}
      class="flex flex-col gap-1"
    >
      <For each={currentLayout}>
        {rows => (
          <div class="flex flex-row gap-1">
            <For each={rows}>
              {(padId) => (
                <div
                  data-note={padId}
                  id={props.launchpadId ? getPadElementId(padId, props.launchpadId) : undefined}

                  onContextMenu={event => {
                    event.preventDefault();

                    // Execute the custom behaviour if it exists.
                    if (!props.onContextMenu) return;
                    return props.onContextMenu(padId, event, props.launchpadId);
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

                      props.onPadUp(padId, pad, props.launchpadId);
                      document.removeEventListener("touchend", handleTouchEnd);
                    };

                    props.onPadDown(padId, pad, props.launchpadId);
                    document.addEventListener("touchend", handleTouchEnd);
                  }}

                  onMouseDown={down_event => {
                    if (down_event.button === 2) return;

                    // We save the target pad HTML element.
                    const pad = down_event.currentTarget;

                    const handleMouseUp = (up_event: MouseEvent) => {
                      if (up_event.button === 2) return;

                      props.onPadUp(padId, pad, props.launchpadId);
                      document.removeEventListener("mouseup", handleMouseUp);
                    };

                    props.onPadDown(padId, pad, props.launchpadId);
                    document.addEventListener("mouseup", handleMouseUp);
                  }}

                  class="w-full bg-gray-400 rounded-sm select-none aspect-square"
                />
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
};

export default Launchpad;
