import { useMemo, useEffect } from "react";
import ReactDOM from "react-dom";

export type PortalProps = {
  children: React.ReactNode;
  className: string;
  parent?: HTMLElement;
}

export default function Portal ({
  children, parent, className
}: PortalProps) {
  const element = useMemo(() => document.createElement("div"), []);

  useEffect(() => {
    const target = parent && parent.appendChild
      ? parent
      : document.body;

    // Get the classNames to add to element.
    const classList = ["portal-container"];
    if (className)
      className.split(" ").forEach((item) => classList.push(item));

    // Append the classNames to element.
    classList.forEach((item) => element.classList.add(item));
    
    // Add element to DOM.
    target.appendChild(element);

    return () => {
      target.removeChild(element);
    };
  }, [element, parent, className]);

  return ReactDOM.createPortal(children, element);
}
