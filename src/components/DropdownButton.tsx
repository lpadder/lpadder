import type { Component, JSX } from "solid-js";
import { Menu, Transition, MenuItem, Popover, PopoverButton, PopoverPanel } from "solid-headless";

const DropdownButton: Component<{
  items: { name?: string, action?: () => unknown }[][],
  buttonIcon: JSX.Element,
  buttonClassName: string
}> = (props) => {
  return (
    <Popover class="relative">
      {({ isOpen }) => (
        <>
          <PopoverButton
            class={`flex ${props.buttonClassName}`}
          >
            {props.buttonIcon}
          </PopoverButton>

          <Transition
            show={isOpen()}
            enter="transition duration-200"
            enterFrom="opacity-0 -translate-y-1 scale-50"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition duration-150"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 -translate-y-1 scale-50"
          >
            <PopoverPanel unmount={false} class="absolute z-10 px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
              <Menu class="bg-gray-800 p-2 rounded-lg shadow-lg flex flex-col gap-1 z-50 absolute right-0 mt-2 w-56 origin-top-right">
                <For each={props.items}>
                  {group_items => (
                    <div class="bg-gray-900 rounded-md p-2">
                      <For each={group_items}>
                        {item => (
                          <MenuItem
                            as="button"
                            onClick={item.action}
                            class="hover:bg-gray-600 hover:bg-opacity-60 bg-gray-600 bg-opacity-40 w-full block px-2 py-2 text-sm rounded transition-colors cursor-pointer mb-1 last:mb-0"
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
