interface SelectProps {
  children: React.ReactNode;

  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  value?: string | number;
  name?: string;
  
  placeholder: string;
  title?: string;
}

export default function Select ({
  children,
  
  onChange,
  value,
  name,
  
  placeholder,
  title
}: SelectProps) {

  return (
    <select
      placeholder={placeholder}
      title={title}

      onChange={onChange}
      className="
        py-2 px-4 w-full rounded-lg outline-none
        bg-gray-900 bg-opacity-40
        transition-colors focus:bg-opacity-100
        text-gray-400 appearance-none

        border border-gray-900 hover:bg-opacity-60 focus:border-gray-400
      "

      name={name}
      value={value}
    >
      {children}
    </select>
  );
}