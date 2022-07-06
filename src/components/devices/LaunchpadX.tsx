import type { DeviceComponent } from "@/components/devices";
import { DeviceButton } from "@/components/devices";

import { devicesConfiguration } from "@/utils/devices";
import { classNames } from "@/utils/styling";

const LaunchpadX: DeviceComponent = (props) => {
  const configuration = devicesConfiguration["launchpad_x"];

  return (
    <div class="flex flex-col gap-1" ref={props.ref}>
      <For each={configuration.layout_to_use}>
        {(rows, rowIndex) => (
          <div class="flex flex-row gap-1">
            <For each={rows}>
              {(padId) => (padId !== -1)
                ? <DeviceButton
                  class={classNames(
                    (
                      rowIndex() === 0
                      || padId.toString()[1] === "9"
                    )
                      ? "__phantom-pad" : "",
                    "bg-gray-400 h-full w-full aspect-square rounded-sm"
                  )}
                  id={padId}
                  context={props.onContext}
                  up={props.onPadUp}
                  down={props.onPadDown}
                /> : <div class="h-full w-full" />
              }
            </For>
          </div>
        )}
      </For>
    </div>
  );
};

export default LaunchpadX;
