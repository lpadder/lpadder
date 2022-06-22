import type { Component } from "solid-js";

const NotFound: Component = () => {
  console.info("[...404] route not found, redirecting to '/' route.");
  return <Navigate href="/" />;
};

export default NotFound;
