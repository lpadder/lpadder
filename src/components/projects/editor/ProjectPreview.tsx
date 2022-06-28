import type { Component, JSX } from "solid-js";

import { currentProjectStore, setCurrentProjectStore } from "@/stores/current_project";

import { log } from "@/utils/logger";

/**
 * This determines the position of X = 0
 * depending on the width of the canvas.
 */
const canvasX0 = () => (currentProjectStore.metadata?.canvasWidth || 0) / 2;

/**
 * This determines the position of Y = 0
 * depending on the height of the canvas.
 */
const canvasY0 = () => (currentProjectStore.metadata?.canvasHeight || 0) / 2;

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
  let canvas_ref: HTMLDivElement | undefined;

  /** When this is true, the preview canvas takes all the screen. */
  const [isPreviewCanvasFullscreen, setPreviewCanvasFullscreen] = createSignal(false);

  /** Adds `x` to `left` and `y` to `top`. */
  const updateCanvasPosition = (x?: number, y?: number) => {
    if (!canvas_ref) return;

    const current_x = parseInt(canvas_ref.style.left.replace("px", ""));
    canvas_ref.style.left = current_x + (x || 0) + "px";

    const current_y = parseInt(canvas_ref.style.top.replace("px", ""));
    canvas_ref.style.top = current_y + (y || 0) + "px";
  };

  /** Correct the position of the canvas after a move. */
  const canvasCorrectMove = () => {
    if (!canvas_ref) return;

    // Correcting left/width from the left.
    const widthOffset = canvas_ref.offsetLeft;
    if (widthOffset > 0) {
      setCurrentProjectStore("metadata", "canvasWidth", currentWidth => currentWidth + widthOffset);
      updateCanvasPosition(-widthOffset, undefined);
    }

    // Correcting top/height from the top.
    const heightOffset = canvas_ref.offsetTop;
    if (heightOffset > 0) {
      setCurrentProjectStore("metadata", "canvasHeight", currentHeight => currentHeight + heightOffset);
      updateCanvasPosition(undefined, -heightOffset);
    }

    // Correcting left/width from the right.
    const widthRightOffset = canvas_ref.offsetWidth + canvas_ref.offsetLeft - window.innerWidth;
    if (widthRightOffset <= 0) {
      const missingOffset = -widthRightOffset;
      setCurrentProjectStore("metadata", "canvasWidth", currentWidth => currentWidth + missingOffset);
    }

    // Correcting top/height from the bottom.
    const heightBottomOffset = canvas_ref.offsetHeight + canvas_ref.offsetTop - window.innerHeight;
    if (heightBottomOffset <= 0) {
      const missingOffset = -heightBottomOffset;
      setCurrentProjectStore("metadata", "canvasHeight", currentHeight => currentHeight + missingOffset);
    }
  };

  const canvasMouseMove = (evt: MouseEvent) => {
    updateCanvasPosition(evt.movementX, evt.movementY);
    canvasCorrectMove();
  };

  const canvasMouseDown = (evt: MouseEvent) => {
    if (evt.target !== canvas_ref) return;

    // We only accept the left click for dragging.
    if (evt.button !== 0) return;

    window.addEventListener("mousemove", canvasMouseMove);

    /** When the user release the left click, we remove the move and up events. */
    const mouseUpFunction = () => {
      window.removeEventListener("mousemove", canvasMouseMove);
      window.removeEventListener("mouseup", mouseUpFunction);
    };

    window.addEventListener("mouseup", mouseUpFunction);
  };

  let previousTouchX = 0, previousTouchY = 0;
  const canvasTouchMove = (evt: TouchEvent) => {
    const touch = evt.changedTouches[0];

    const currentScreenX = Math.round(touch.screenX);
    const currentScreenY = Math.round(touch.screenY);

    // Get the movement event based on the previous event.
    const movementX = currentScreenX - previousTouchX;
    const movementY = currentScreenY - previousTouchY;

    updateCanvasPosition(movementX, movementY);
    canvasCorrectMove();

    // Updating the touch old position values.
    previousTouchX = currentScreenX, previousTouchY = currentScreenY;
  };

  const canvasTouchStart = (evt: TouchEvent) => {
    if (evt.target !== canvas_ref) return;

    // We only accept one finger for dragging.
    if (evt.touches.length > 1) return;
    const touch = evt.changedTouches[0];

    const currentScreenX = Math.round(touch.screenX);
    const currentScreenY = Math.round(touch.screenY);

    // We initialize the position of the touch.
    previousTouchX = currentScreenX, previousTouchY = currentScreenY;

    window.addEventListener("touchmove", canvasTouchMove);

    /** When the user release the touch, we remove the move and up events. */
    const touchEndFunction = () => {
      window.removeEventListener("touchmove", canvasTouchMove);
      window.removeEventListener("touchend", touchEndFunction);
    };

    window.addEventListener("touchend", touchEndFunction);
  };

  onMount(() => {
    if (!canvas_ref) return;
    canvas_ref.addEventListener("mousedown", canvasMouseDown);
    canvas_ref.addEventListener("touchstart", canvasTouchStart);
  });

  onCleanup(() => {
    if (!canvas_ref) return;
    canvas_ref.removeEventListener("mousedown", canvasMouseDown);
  });

  return (
    <div class="relative h-80 bg-gray-800 overflow-hidden shadow-md shadow-inner">
      <div class="z-15 absolute top-4 right-4">

        <ProjectPreviewButton
          title="Settings"
          action={() => log("settings", "open")}
          icon={<IconMdiCog />}
        />
      </div>

      <div class="z-15 absolute bottom-20 right-4">
        <ProjectPreviewButton
          title="Fullscreen"
          action={() => setPreviewCanvasFullscreen(prev => !prev)}
          icon={<IconMdiFullscreen />}
        />
      </div>

      {/** The `clip-path` is used here to clip the "canvas". */}
      <div class="h-full w-full" style={
        isPreviewCanvasFullscreen() ? "" : "clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);"
      }>
        {/** Canvas where all the devices will be drawn. */}
        <div ref={canvas_ref}
          class={`
            fixed bg-pink-400
            ${isPreviewCanvasFullscreen() ? "z-10 " : "-z-99"}
          `}

          style={{
            /**
             * We take the height and width from the project's metdata
             * so we have the same settings for everyone.
             */
            height: currentProjectStore.metadata?.canvasHeight + "px",
            width: currentProjectStore.metadata?.canvasWidth + "px",
            left: "0px", top: "0px" /** These are default values for X and Y. */
          }}
        >
          <div style={{
            left: canvasX0() + "px", top: canvasY0() + "px"
          }} class="bg-gray-600 h-32 w-32 absolute left-2"></div>
        </div>
      </div>

      {/** This is only to make the style gradient at the end of the preview. */}
      <div class="z-5 absolute bottom-0 h-16 w-full bg-gradient-to-b from-transparent to-gray-800"></div>

    </div>
  );
};

export default ProjectPreview;
