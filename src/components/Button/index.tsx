import styles from "./index.module.scss";

export function Button ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) {
  return (
    <button
      className={styles.button}
      {...props}
    >
      {children}
    </button>
  )
}