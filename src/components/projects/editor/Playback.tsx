import Select from "@/components/Select";
import type { Component } from "solid-js";

const Playback: Component = () => {

  return (
    <div class="pointer-events-none absolute top-0 h-full w-full bg-transparent">

      <div class="pointer-events-auto md:(w-auto right-18 left-4 bottom-4 h-20) flex gap-2 absolute bottom-0 h-16 w-full">

        <div class="flex bg-gray-900 rounded-lg p-y-4 px-6 gap-8 text-2xl justify-center items-center">
          <IconMdiChartTimeline />
          <IconMdiPiano />
          <IconMdiLightningBolt />
        </div>

        <Select>
          <option>Select a page</option>
        </Select>
      </div>

    </div>
  );
};

export default Playback;
