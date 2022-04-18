export type InputProps = {
  type?: "text" | "number";
  className?: string;
  labelName: string;
  placeholder: string;
  smallTipText?: string;

  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;

  max?: number;
  min?: number;
};

export default function Input ({
  type = "text",
  className,
  labelName,
  placeholder,
  smallTipText,
  value,
  onChange,

  max, min
}: InputProps) {
  return (
    <div>
      <label htmlFor={labelName} className="text-sm font-medium mb-1">
        {labelName}
      </label>
      <input
        type={type}
        value={value}
        name={labelName}
        onChange={onChange}
        placeholder={placeholder}

        min={min}
        max={max}

        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"

        className={`
          py-2 px-4 w-full rounded-lg outline-none
          m:text-sm
          bg-gray-900 bg-opacity-40
          transition-colors focus:bg-opacity-100
          ${className ? className : ""}
        `}
      />

      {smallTipText &&
        <p className="mt-2 text-sm text-gray-600 text-opacity-60">
          {smallTipText}
        </p>
      }
    </div>
  );
}