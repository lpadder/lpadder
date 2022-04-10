import {
  useRef,
  useEffect,
  Fragment
} from "react";

import Portal from "@/components/Portal";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal ({
  open, onClose, children
}: ModalProps) {
  const backdrop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backdropElement = backdrop.current as HTMLDivElement;

    // Close modal on ESC.
    const keyHandler = (e: KeyboardEvent) => e.code === "Escape" && onClose();

    // Close modal on backdrop click.
    const clickHandler = (e: MouseEvent) => e.target === backdropElement && onClose();

    if (backdrop.current) {
      backdropElement.addEventListener("click", clickHandler);
      window.addEventListener("keyup", keyHandler);
    }

    return () => {
      if (backdrop.current) {
        backdrop.current.removeEventListener("click", clickHandler);
      }

      window.removeEventListener("keyup", keyHandler);
    };
  }, [open, onClose]);

  return (
    <Fragment>
      {open && (
        <Portal>
          <div
            ref={backdrop}
            className={`${open && "flex fixed top-0 left-0 z-50 justify-center items-center w-screen h-screen bg-gray-900 bg-opacity-60"}`}
          >
            <div className="p-4 mx-4 w-full max-w-md bg-gray-800 rounded-lg border-2 border-gray-900 shadow-lg shadow-gray-900">
              {children}
            </div>
          </div>
        </Portal>
      )}
    </Fragment>
  );
}
