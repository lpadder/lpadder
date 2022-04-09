export type InputProps = {
  className?: string;
  labelName: string;
  placeholder: string;
  smallTipText?: string;

  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export default function Input ({
  className,
  labelName,
  placeholder,
  smallTipText,
  value,
  onChange
}: InputProps) {
  return (
    <div>
      <label htmlFor={labelName} className="text-sm font-medium mb-1">
        {labelName}
      </label>
      <input
        value={value}
        name={labelName}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          p-2 w-full rounded outline-none
          m:text-sm
          bg-gray-800 bg-opacity-40
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