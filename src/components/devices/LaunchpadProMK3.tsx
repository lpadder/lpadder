import type { DeviceComponent } from "@/components/devices";
import { DeviceButton } from "@/components/devices";

import { devicesConfiguration } from "@/utils/devices";
import { classNames } from "@/utils/styling";

import novation from "@/assets/novation-inline.svg";

const LaunchpadProMK3: DeviceComponent = (props) => {
  const configuration = devicesConfiguration["launchpad_pro_mk3"];

  return (
    <div class="flex flex-col gap-0.5" ref={props.ref}>
      <For each={configuration.layout_to_use}>
        {(rows, rowIndex) => (
          <div
            class="flex flex-row gap-1"
            classList={{
              // Trick to remove the space for the two control last rows.
              "mb-0.5": !(rowIndex() === 9 || rowIndex() === 10)
            }}
          >
            <For each={rows}>
              {(padId) => (padId !== -1 && padId !== 99)
                ? <DeviceButton
                  class={classNames(
                    (
                      rowIndex() === 0
                      || (padId.toString()[1] === "0" && padId <= 100)
                      || padId.toString()[1] === "9"
                    )
                      /** The controls are phantom and square. */
                      ? "__phantom-pad aspect-square after:rounded-sm"
                      /** Since the last two control rows aren't square, we reduce the height. */
                      : (rowIndex() === 9 || rowIndex() === 10)
                        ? "__phantom-pad __lp_pro_mk3_bottom_pad after:rounded-sm"
                        /** All the other pads are gray squares. */
                        : "aspect-square",
                    "bg-slate-400 rounded-sm h-full w-full",
                    padId === 90 &&"transform scale-50"
                  )}
                  id={padId}
                  context={props.onContext}
                  up={props.onPadUp}
                  down={props.onPadDown}
                /> : (padId === 99)
                  ? (
                    <div
                      class="h-full w-full bg-slate-400 rounded-sm aspect-square transform scale-75"
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

export default LaunchpadProMK3;
