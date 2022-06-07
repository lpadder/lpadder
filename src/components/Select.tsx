import type { ParentComponent, JSX } from "solid-js";

const Select: ParentComponent<JSX.IntrinsicElements["select"]> = (props) => {
  return (
    <select
      class="
        py-2 px-4 w-full rounded-lg outline-none
        bg-gray-900 bg-opacity-40
        transition-colors focus:bg-opacity-100
        text-gray-400 appearance-none

        border border-gray-900 hover:bg-opacity-60 focus:border-gray-400
      "
      {...props}
    />
  );
};

export default Select;