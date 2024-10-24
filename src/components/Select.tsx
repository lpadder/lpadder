import type { ParentComponent, JSX } from "solid-js";

const Select: ParentComponent<JSX.IntrinsicElements["select"]> = (props) => {
  return (
    <select
      {...props}
      class={`
        py-2 px-4 w-full rounded-lg outline-none
        bg-slate-900 bg-opacity-40
        transition-colors focus:bg-opacity-100
        text-slate-400 appearance-none

        border border-slate-900 hover:bg-opacity-60 focus:border-slate-400

        ${props.class ?? ""}
      `}
    />
  );
};

export default Select;
