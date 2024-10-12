import type { DeviceComponent } from "@/components/devices";
import { DeviceButton } from "@/components/devices";

import { devicesConfiguration } from "@/utils/devices";
import { classNames } from "@/utils/styling";

const LaunchpadProMK2: DeviceComponent = (props) => {
  // We take the `launchpad_pro_mk2` since the CFWs have the same layout.
  const configuration = devicesConfiguration["launchpad_pro_mk2"];

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
                      || rowIndex() === 9
                      || padId.toString()[1] === "0"
                      || padId.toString()[1] === "9"
                    )
                      ? "__phantom-pad rounded-full after:rounded-full"
                      : "rounded-sm",
                    "bg-slate-400 h-full w-full aspect-square"
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

      {/** Mode light on the LP Pro MK2 has the `99` MIDI note. */}
      <div
        data-note={99}
        class="absolute bottom-0 left-0 right-0 w-1 h-1 bg-slate-600 mx-auto"
      />
    </div>
  );
};

export default LaunchpadProMK2;
