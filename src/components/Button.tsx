import type { ParentComponent, JSX } from "solid-js";

const Button: ParentComponent<JSX.HTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button
      class={`
        whitespace-nowrap px-4 py-2 rounded-lg
        text-gray-300 flex justify-center items-center
        bg-gray-900 bg-opacity-20
        border border-gray-900 
        transition-all
        ${props.class ? props.class : ""}
      `}
      
      {...props}
    />
  );
};

export default Button;