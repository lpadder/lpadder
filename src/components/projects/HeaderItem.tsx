import type { ParentComponent } from "solid-js";

const HeaderItem: ParentComponent = (props) => (
  <li
    class="flex justify-center items-center"
    {...props}
  />
);

export default HeaderItem;
