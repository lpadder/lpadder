import type { Component } from "solid-js";
import LpadderLogo from "@/assets/icon.png";

const FullLoader: Component<{
  message: string
}> = (props) => {
  return (
    <div
      class="flex fixed top-0 left-0 flex-col gap-6 justify-center items-center w-screen h-screen bg-gray-900 bg-opacity-60"
    >
      <div
        class="flex flex-col gap-4 justify-center items-center"
      >
        <img
          class="w-24 h-24" alt="lpadder's logo"
          src={LpadderLogo}
        />
        <span
          class="font-medium text-gray-400 text-opacity-80"
        >
          lpadder.
        </span>
      </div>
      <h2
        class="px-6 py-2 text-lg bg-gradient-to-r from-blue-500 to-pink-500 rounded-full"
      >
        {props.message}
      </h2>
    </div>
  );
};

export default FullLoader;
