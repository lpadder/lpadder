import type { Component, JSX } from "solid-js";
import { Menu, Transition, MenuItem, Popover, PopoverButton, PopoverPanel } from "solid-headless";
import { classNames } from "@/utils/styling";

const DropdownButton: Component<{
  items: { name?: string, action?: () => unknown }[][],
  buttonIcon: JSX.Element,
  buttonClassName?: string,
  /** Force the dropdown to `translate-x` itself. */
  forceOpenToRight?: boolean
}> = (props) => {
  return (
    <Popover class="relative z-99">
      {({ isOpen, setState }) => (
        <>
          <PopoverButton class={classNames("flex", props.buttonClassName)}>
            {props.buttonIcon}
          </PopoverButton>

          <Transition
            show={isOpen()}
            class="transform"
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-85"
          >
            <PopoverPanel
              unmount={false}
              class="absolute p-2 sm:px-0 lg:max-w-3xl"
              classList={{
                "transform translate-x-48": props.forceOpenToRight
              }}
            >
              <Menu class={classNames("transition flex flex-col gap-1 absolute right-0 w-48", props.forceOpenToRight ? "origin-top-left" : "origin-top-right")}>
                <For each={props.items}>
                  {group_items => (
                    <div class="rounded-md backdrop-filter backdrop-blur bg-gray-800 bg-opacity-80 border border-gray-900 p-1.5">
                      <For each={group_items}>
                        {item => (
                          <MenuItem
                            as="button"
                            onClick={() => {
                              setState(false); // Closes the dropdown.
                              if (item.action) item.action();
                            }}
                            class="hover:(bg-gray-600 bg-opacity-100) bg-gray-400 bg-opacity-60 w-full block px-2 py-2 text-sm rounded transition-colors cursor-pointer mb-1 last:mb-0"
                          >
                            {item.name}
                          </MenuItem>
                        )}
                      </For>
                    </div>
                  )}
                </For>
              </Menu>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default DropdownButton;
