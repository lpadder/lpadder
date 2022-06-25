import type { Component, JSX } from "solid-js";

import { log } from "@/utils/logger";

const ProjectPreviewButton: Component<{
  title: string;
  icon: JSX.Element;
  action: () => unknown;
}> = (props) => (
  <button
    class="p-1.5 flex text-xl rounded-md shadow-md bg-gray-500 bg-opacity-40 opacity-80 transition hover:(opacity-100 bg-opacity-60)"
    onClick={() => props.action()}
    title={props.title}
  >
    {props.icon}
  </button>
);

const ProjectPreview: Component = () => {

  return (
    <div class="relative h-64 bg-gray-700">
      <div class="absolute top-4 right-4">

        <ProjectPreviewButton
          title="Settings"
          action={() => log("settings", "open")}
          icon={<IconMdiCog />}
        />
      </div>

      <div class="absolute bottom-4 right-4">
        <ProjectPreviewButton
          title="Fullscreen"
          action={() => log("fullscreen", "open")}
          icon={<IconMdiFullscreen />}
        />
      </div>

    </div>
  );
};

export default ProjectPreview;
