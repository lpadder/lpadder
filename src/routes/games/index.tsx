import type { Component } from "solid-js";

const GamesHome: Component = () => {
  return (
    <>
      <Title>lpadder - games</Title>
      <div class="flex mx-auto w-96 gap-2 h-screen flex-col justify-center items-center">
        <p class="text-center">Sorry, but there's nothing here currently ! <br />Try to come back after the next release.</p>
        <Link href="/" class="inline-block py-2 px-4 rounded border border-pink-500 bg-pink-500 bg-opacity-20 text-pink-200">Go back to lpadder</Link>
      </div>
    </>
  );
};

export default GamesHome;
