export function Button ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) {
  return (
    <button
      className=""
      {...props}
    >
      {children}
    </button>
  )
}