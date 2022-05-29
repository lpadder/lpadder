import type { ParentComponent } from "solid-js";

import { onCleanup, onMount, Show, children } from "solid-js";
import { Portal } from "solid-js/web";

const Modal: ParentComponent<{
  open: boolean;
  onClose: () => void;
}> = (props) => {
  let backdrop: HTMLDivElement | undefined;

  /** Close modal on `Escape` key. */
  const keyHandler = (e: KeyboardEvent) => e.code === "Escape" && props.onClose();

  /** Close modal on backdrop element click. */
  const clickHandler = (e: MouseEvent) => e.target === backdrop && props.onClose();

  onMount(() => {
    if (!backdrop) return;

    backdrop.addEventListener("click", clickHandler);
    window.addEventListener("keyup", keyHandler);
  });

  onCleanup(() => {
    if (!backdrop) return;

    backdrop.removeEventListener("click", clickHandler);
    window.removeEventListener("keyup", keyHandler);
  });

  return (
    <Show when={props.open}>
      <Portal>
        <div
          ref={backdrop}
          class={`${props.open && "flex fixed top-0 left-0 z-50 justify-center items-center w-screen h-screen bg-gray-900 bg-opacity-60"}`}
        >
          <div class="p-4 mx-4 w-full max-w-md bg-gray-800 rounded-lg border-2 border-gray-900 shadow-lg shadow-gray-900">
            {children(() => props.children)()}
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default Modal;