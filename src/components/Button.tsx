import type { ParentComponent, JSX } from "solid-js";

const Button: ParentComponent<JSX.IntrinsicElements["button"]> = (props) => {
  return (
    <button
      class={`
        whitespace-nowrap px-4 py-2 rounded-lg
        text-slate-300 flex justify-center items-center
        bg-slate-900 bg-opacity-20
        border border-slate-900 
        transition-all
        ${props.class ? props.class : ""}
      `}

      {...props}
    />
  );
};

export default Button;
