import { useMemo, useEffect } from "react";
import ReactDOM from "react-dom";

export type PortalProps = {
  children: React.ReactNode;
  parent?: HTMLElement;
}

export default function Portal ({
  children, parent
}: PortalProps) {
  const element = useMemo(() => document.createElement("div"), []);

  useEffect(() => {
    const target = parent && parent.appendChild
      ? parent
      : document.body;

    // Add element to DOM.
    target.appendChild(element);

    return () => {
      target.removeChild(element);
    };
  }, [element, parent]);

  return ReactDOM.createPortal(children, element);
}
