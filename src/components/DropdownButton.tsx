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
    <Popover defaultOpen={false} class="relative z-99">
      {({ isOpen, setState }) => (
        <>
          <PopoverButton class={classNames("flex", props.buttonClassName)}>
            {props.buttonIcon}
          </PopoverButton>

          <Transition
            show={isOpen()}
            enter="transform transition duration-200"
            enterFrom="transform opacity-0 -translate-y-1 scale-50"
            enterTo="transform opacity-100 translate-y-0 scale-100"
            leave="transform transition duration-150"
            leaveFrom="transform opacity-100 translate-y-0 scale-100"
            leaveTo="transform opacity-0 -translate-y-1 scale-50"
          >
            <PopoverPanel
              unmount={false}
              class="absolute z-10 px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl"
              classList={{
                "transform translate-x-48": props.forceOpenToRight
              }}
            >
              <Menu class={classNames("transition flex flex-col gap-1 absolute right-0 w-48", props.forceOpenToRight ? "origin-top-left" : "origin-top-right")}>
                <For each={props.items}>
                  {group_items => group_items.length > 0 && (
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
