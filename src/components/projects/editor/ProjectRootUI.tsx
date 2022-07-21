import Select from "@/components/Select";
import type { Component, JSX } from "solid-js";

import Sampling from "@/components/projects/editor/Sampling";

type UISelectorType =
  | "none"
  | "sampling"

const [selected, setSelected] = createSignal<UISelectorType>("none");

const IconItemSelector: Component<{
  icon: JSX.Element,
  selector: UISelectorType
}> = (props) => (
  <button
    class="flex p-2 rounded-md"
    classList={{
      "bg-gray-800": selected() === props.selector,
      "hover:(bg-gray-800 bg-opacity-60)": selected() !== props.selector
    }}
    onClick={() => setSelected(prev => prev === props.selector ? "none" : props.selector)}
  >
    {props.icon}
  </button>
);

const ProjectRootUI: Component = () => {

  return (
    <>
      {/** Actual UI */}
      <Switch>
        <Match when={selected() === "sampling"}>
          <Sampling />
        </Match>
      </Switch>

      {/** Selectors */}
      <div class="absolute bottom-4 h-20 w-full bg-transparent">

        <div class="pointer-events-auto md:(w-auto right-18 left-4 h-20) flex gap-4 absolute h-16 px-4 w-full">

          <div class="flex bg-gray-900 rounded-lg px-6 gap-8 text-2xl justify-center items-center">
            <IconItemSelector
              icon={<IconMdiChartTimeline />}
              selector="sampling"
            />
            <IconMdiPiano />
            <IconMdiLightningBolt />
          </div>

          <Select>
            <option>Select a page</option>
          </Select>
        </div>

      </div>
    </>
  );
};

export default ProjectRootUI;
