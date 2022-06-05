import type { ParentComponent, JSX } from "solid-js";

/**
 * Use the HTML attributes of the input element
 * and also add a `label` prop.
 */
type FileInputProps = ParentComponent<
  JSX.HTMLAttributes<HTMLInputElement> & { label?: string }
>;

const FileInput: FileInputProps = (props) => {
  return (
    <div class="group overflow-hidden relative max-w-64 sm:w-full">
      <button class="
        text-white font-medium inline-flex items-center justify-center
        py-2 px-6 w-full rounded-lg outline-none
        bg-gray-900 bg-opacity-60
        transition-colors

        border border-gray-900 group-hover:bg-opacity-80 focus:border-gray-400
      ">
        {props.label}
      </button>
      <input
        class="file:hidden opacity-0 cursor-pointer absolute block top-0 w-full h-full"
        type="file"
        {...props}
      />
    </div>
  );
};

export default FileInput;
