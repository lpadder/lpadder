import type { ParentComponent, JSX } from "solid-js";

const NavbarHeadItem: ParentComponent<{ onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> }> = (props) => (
  <button
    class="py-1 mx-4 w-full font-medium rounded backdrop-blur-md transition-colors hover:bg-gray-100 hover:bg-opacity-10 hover:shadow-sm"
    {...props}
  />
);

export default NavbarHeadItem;