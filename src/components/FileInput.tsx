interface FileInputProps {
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;

  accept?: string;
  multiple?: boolean;
}

export default function FileInput ({
  label,
  onChange,
  accept,
  multiple = false,
}: FileInputProps) {
  return (
    <div className="group overflow-hidden relative max-w-64 sm:w-full">
      <button className="
        text-white font-medium inline-flex items-center justify-center
        py-2 px-6 w-full rounded-lg outline-none
        bg-gray-900 bg-opacity-60
        transition-colors

        border border-gray-900 group-hover:bg-opacity-80 focus:border-gray-400
      ">
        {label}
      </button>
      <input
        className="file:hidden opacity-0 cursor-pointer absolute block top-0 w-full h-full"
        type="file"
        onChange={onChange}

        accept={accept}
        multiple={multiple}
      />
    </div>
  );
}
