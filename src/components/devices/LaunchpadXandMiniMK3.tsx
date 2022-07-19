import type { DeviceComponent } from "@/components/devices";
import { DeviceButton } from "@/components/devices";

import { devicesConfiguration } from "@/utils/devices";
import { classNames } from "@/utils/styling";

import novation from "@/assets/novation-inline.svg";

const LaunchpadX: DeviceComponent = (props) => {
  const configuration = devicesConfiguration["launchpad_x"];

  return (
    <div class="flex flex-col gap-1" ref={props.ref}>
      <For each={configuration.layout_to_use}>
        {(rows, rowIndex) => (
          <div class="flex flex-row gap-1">
            <For each={rows}>
              {(padId) => (padId !== -1 && padId !== 99)
                ? <DeviceButton
                  class={classNames(
                    (
                      rowIndex() === 0
                      || padId.toString()[1] === "9"
                    )
                      ? "__phantom-pad rounded-sm" : "",
                    "bg-gray-400 h-full w-full aspect-square rounded-sm"
                  )}
                  id={padId}
                  context={props.onContext}
                  up={props.onPadUp}
                  down={props.onPadDown}
                /> : (padId === 99)
                  ? (
                    <div
                      class="h-full w-full bg-gray-400 rounded-sm aspect-square transform scale-75"
                      data-note={padId}
                    >
                      <img
                        class="h-full w-full"
                        src={novation}
                      />
                    </div>
                  ) : <div class="h-full w-full" />
              }
            </For>
          </div>
        )}
      </For>
    </div>
  );
};

export default LaunchpadX;
