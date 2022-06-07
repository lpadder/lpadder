import type { ParentComponent, JSX } from "solid-js";
import { Show } from "solid-js";

/**
 * Use the HTML attributes of the input element
 * and also add a required `label` prop.
 */
type InputProps = ParentComponent<
  JSX.IntrinsicElements["input"] & {
    label?: string,
    tip?: string
  }
>;

const Input: InputProps = (props) => {
  return (
    <div>
      <Show when={props.label}>
        <label
          for={`__input_label_${props.label}`}
          class="text-sm font-medium mb-1"
        >
          {props.label}
        </label>
      </Show>
      <input
        id={`__input_label_${props.label}`}
        class={`
          py-2 px-4 w-full rounded-lg outline-none
          bg-gray-900 bg-opacity-40
          transition-colors focus:bg-opacity-100
          ${props.class ? props.class : ""}
        `}

        {...props}
      />

      <Show when={props.tip}>
        <p class="mt-2 text-sm text-gray-600 text-opacity-60">
          {props.tip}
        </p>
      </Show>
    </div>
  );
};

export default Input;
