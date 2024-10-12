import type { ParentComponent, JSX } from "solid-js";

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
  const [local, others] = splitProps(props, ["tip", "label", "class"]);

  return (
    <div>
      <Show when={local.label}>
        <label
          for={`__input_label_${local.label}`}
          class="text-sm font-medium mb-1"
        >
          {local.label}
        </label>
      </Show>
      <input
        id={`__input_label_${local.label}`}
        class={`
          py-2 px-4 w-full rounded-lg outline-none
          bg-slate-900 bg-opacity-40
          transition-colors focus:bg-opacity-100
          ${local.class ? local.class : ""}
        `}

        {...others}
      />

      <Show when={local.tip}>
        <p class="mt-2 text-sm text-slate-600 text-opacity-60">
          {local.tip}
        </p>
      </Show>
    </div>
  );
};

export default Input;
