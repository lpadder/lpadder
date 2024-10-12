import type { Component, JSX } from "solid-js";

import { currentProjectStore, setCurrentProjectStore } from "@/stores/current_project";
import { log } from "@/utils/logger";

import DeviceInPreview from "@/components/projects/editor/DeviceInPreview";

const [isPreviewCanvasFullscreen, setPreviewCanvasFullscreen] = createSignal(false);
export { setPreviewCanvasFullscreen };

const ProjectPreviewButton: Component<{
  title: string;
  icon: JSX.Element;
  action: () => unknown;
}> = (props) => (
  <button
    class="p-1.5 flex text-xl rounded-md shadow-md bg-slate-500 bg-opacity-40 opacity-80 transition hover:(opacity-100 bg-opacity-60)"
    onClick={() => props.action()}
    title={props.title}
  >
    {props.icon}
  </button>
);

/** Adds `x` to `left` and `y` to `top`. */
const updateCanvasPosition = (x?: number, y?: number) => {
  setCurrentProjectStore("metadata", "defaultCanvasViewPosition", (prev) => ({
    x: prev.x + (x || 0),
    y: prev.y + (y || 0)
  }));
};

let canvas_ref: HTMLDivElement | undefined;
export const correctCanvasMove = () => {
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

const ProjectPreview: Component = () => {
  const canvasMouseMove = (evt: MouseEvent) => {
    updateCanvasPosition(evt.movementX, evt.movementY);
    correctCanvasMove();
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
    correctCanvasMove();

    // Updating the touch old position values.
    previousTouchX = currentScreenX, previousTouchY = currentScreenY;
  };

  const canvasTouchStart = (evt: TouchEvent) => {
    if (evt.target !== canvas_ref) return;

    // We only accept one finger for dragging.
    if (evt.touches.length > 1) return;
    evt.preventDefault();
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

  const [windowWidth, setWindowWidth] = createSignal(window.innerWidth);
  const [windowHeight, setWindowHeight] = createSignal(window.innerHeight);

  /** Corect the canvas when the window is resized to prevent gaps. */
  const windowResizePreview = () => {
    batch(() => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    });
    correctCanvasMove();
  };

  onMount(() => {
    if (!canvas_ref) return;
    canvas_ref.addEventListener("mousedown", canvasMouseDown);
    canvas_ref.addEventListener("touchstart", canvasTouchStart);
    window.addEventListener("resize", windowResizePreview);
  });

  onCleanup(() => {
    if (!canvas_ref) return;
    canvas_ref.removeEventListener("mousedown", canvasMouseDown);
    window.removeEventListener("resize", windowResizePreview);
  });

  const canvasRealMiddle = () => {
    /** Whether we're on the desktop view or not. */
    const isDesktopView = windowWidth() >= 768;
    const DESKTOP_NAVBAR_LEFT_WIDTH = 288;
    const HEADER_TOP_HEIGHT = 80;

    const canvasViewWidth = currentProjectStore.metadata?.canvasWidth || 0;
    const canvasViewHeight = currentProjectStore.metadata?.canvasHeight || 0;

    let canvasViewLeft = (-canvasViewWidth + windowWidth()) / 2;
    if (isDesktopView && !isPreviewCanvasFullscreen()) canvasViewLeft += DESKTOP_NAVBAR_LEFT_WIDTH / 2;

    let canvasViewTop = (-canvasViewHeight / 2);
    if (isPreviewCanvasFullscreen()) canvasViewTop += (windowHeight() / 2);
    else canvasViewTop += (HEADER_TOP_HEIGHT + windowHeight()) / 2;

    return {
      left: canvasViewLeft,
      top: canvasViewTop
    };
  };

  return (
    <Show when={currentProjectStore.slug !== null && currentProjectStore}>{project => (
      <div class="relative h-full bg-slate-800 overflow-hidden">
        <div class={`z-15 ${isPreviewCanvasFullscreen() ? "fixed" : "absolute"} top-4 left-4 flex flex-col gap-2`}>
          <ProjectPreviewButton
            title="Zoom in"
            action={() =>
              setCurrentProjectStore(
                "metadata",
                "defaultCanvasViewPosition",
                "scale", (prev) => prev + 0.2
              )
            }
            icon={<IconMdiMagnifyPlus />}
          />

          <ProjectPreviewButton
            title="Zoom out"
            action={() =>
              setCurrentProjectStore(
                "metadata",
                "defaultCanvasViewPosition",
                "scale", (prev) => {
                  const newValue = prev - 0.2;

                  // When the new value is below 0.2, we restore the view at 0.2
                  if (newValue <= 0.2) return 0.2;
                  else return newValue;
                }
              )
            }
            icon={<IconMdiMagnifyMinus />}
          />
        </div>

        <div class={`z-15 ${isPreviewCanvasFullscreen() ? "fixed" : "absolute"} top-4 right-4`}>
          <ProjectPreviewButton
            title="Settings"
            action={() => log("settings", "open")}
            icon={<IconMdiCog />}
          />
        </div>

        <div class={`z-15 ${isPreviewCanvasFullscreen() ? "fixed" : "absolute"} right-4 bottom-4 hidden sm:(flex flex-col) gap-2`}>
          <ProjectPreviewButton
            title="Reset View"
            action={() => {
              setCurrentProjectStore("metadata", "defaultCanvasViewPosition", {
                x: 0, y: 0
              });
              correctCanvasMove();
            }}
            icon={<IconMdiUndoVariant />}
          />
          <ProjectPreviewButton
            title="Fullscreen"
            action={() => setPreviewCanvasFullscreen(prev => !prev)}
            icon={isPreviewCanvasFullscreen() ? <IconMdiFullscreenExit /> : <IconMdiFullscreen />}
          />
        </div>

        {/** The `clip-path` is used here to clip the "canvas". */}
        <div class="h-full w-full" style={
          isPreviewCanvasFullscreen() ? "" : "clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);"
        }>
          {/** Canvas where all the devices will be drawn. */}
          <div
            ref={canvas_ref}
            class={`
              fixed 
              ${isPreviewCanvasFullscreen() ? "z-10 bg-slate-800" : "-z-99 bg-transparent"}
            `}
            style={{
              height: project.metadata.canvasHeight + "px",
              width: project.metadata.canvasWidth + "px",
              transform: `scale(${project.metadata.defaultCanvasViewPosition.scale})`,
              left: canvasRealMiddle().left + project.metadata.defaultCanvasViewPosition.x + "px",
              top: canvasRealMiddle().top + project.metadata.defaultCanvasViewPosition.y + "px"
            }}
          >
            {/** Line for Y */}
            {/* <span class="absolute bg-slate-700 h-full w-1" style={{ left: project.metadata.canvasWidth / 2 + "px" }}></span> */}
            {/** Line for X */}
            {/* <span class="absolute bg-slate-700 w-full h-1" style={{ top: project.metadata.canvasHeight / 2 + "px" }}></span> */}

            <For each={project.metadata.devices}>
              {device => <DeviceInPreview {...device} />}
            </For>
          </div>
        </div>
      </div>
    )}</Show>
  );
};

export default ProjectPreview;
