interface SelectProps {
  children: React.ReactNode;

  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  name?: string;
  value?: string;
}

export default function Select ({ children, onChange, name, value }: SelectProps) {
  const unFocusOnChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    evt.target.blur();
    return onChange(evt);
  };

  return (
    <select
      onChange={unFocusOnChange}
      className="
        py-2 px-4 w-full rounded-lg outline-none
        bg-gray-900 bg-opacity-40
        transition-colors focus:bg-opacity-100
        text-gray-400 appearance-none

        border border-gray-900 hover:bg-opacity-60 focus:border-gray-400

        focus:rounded-b-none focus:border-b-0
      "

      name={name}
      value={value}
    >
      {children}
    </select>
  );
}