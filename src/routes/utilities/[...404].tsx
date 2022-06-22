import type { Component } from "solid-js";

const UtilitiesNotFound: Component = () => {
  console.info("[...404] route not found, redirecting to '/utilities' route.");
  return <Navigate href="/utilities" />;
};

export default UtilitiesNotFound;
