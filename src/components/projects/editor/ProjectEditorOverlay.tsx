import Select from "@/components/Select";
import type { Component, JSX } from "solid-js";

import Sampling from "@/components/projects/editor/Sampling";

type UISelectorType =
  | "none"
  | "timeline"
  | "piano_roll"
  | "sampling"

const [selected, setSelected] = createSignal<UISelectorType>("none");

const IconItemSelector: Component<{
  icon: JSX.Element,
  selector: UISelectorType
}> = (props) => (
  <button
    title={props.selector.replace(/_/g, " ")}
    class="flex py-2 px-3 rounded-md"
    classList={{
      "bg-gray-800": selected() === props.selector,
      "hover:(bg-gray-800 bg-opacity-60)": selected() !== props.selector
    }}
    onClick={() => setSelected(prev => prev === props.selector ? "none" : props.selector)}
  >
    {props.icon}
  </button>
);

const ProjectEditorOverlay: Component = () => {
  return (
    <>
      {/** TODO: Implement the other components ; Actual UI */}
      <Switch>
        <Match when={selected() === "timeline"}>
          <Sampling />
        </Match>
        <Match when={selected() === "piano_roll"}>
          <Sampling />
        </Match>
        <Match when={selected() === "sampling"}>
          <Sampling />
        </Match>
      </Switch>

      {/** Selectors */}
      <div class="absolute bottom-0 sm:bottom-4 h-20 w-full bg-transparent">

        <div class="pointer-events-auto sm:(w-auto right-14 left-4 h-20) flex gap-4 absolute h-16 px-4 w-full">

          <div class="flex bg-gray-900 rounded-lg px-6 gap-2 text-2xl justify-center items-center">
            <IconItemSelector
              icon={<IconMdiChartTimeline />}
              selector="timeline"
            />
            <IconItemSelector
              icon={<IconMdiPiano />}
              selector="piano_roll"
            />
            <IconItemSelector
              icon={<IconMdiLightningBolt />}
              selector="sampling"
            />
          </div>

          <Select>
            <option>Select a page</option>
          </Select>
        </div>

      </div>
    </>
  );
};

export default ProjectEditorOverlay;
