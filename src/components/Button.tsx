interface ButtonProps {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;

  className?: string;
}

export default function Button ({
  children,
  onClick,
  title,

  className
}: ButtonProps) {
  return (
    <button
      className={`
        whitespace-nowrap px-4 py-2 rounded-lg
        text-gray-300 flex justify-center items-center
        bg-gray-900 bg-opacity-20
        border border-gray-900 
        transition-all
        ${className ? className : ""}
      `}

      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}