import {
  useRef,
  useState,
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

    // Close modal on click.
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
        <Portal className="modal-portal">
          <div
            ref={backdrop}
            className={`${open && "flex fixed top-0 left-0 z-50 justify-center items-center w-screen h-screen bg-gray-900 bg-opacity-60"}`}
          >
            <div className="px-8 py-4 mx-4 space-y-8 w-full max-w-md bg-gray-900 rounded-lg">
              {children}
            </div>
          </div>
        </Portal>
      )}
    </Fragment>
  );
}
