import type { Component } from "solid-js";

const GamesHome: Component = () => {
  return (
    <>
      <Title>lpadder - games</Title>
      <div class="relative min-h-screen">
        <header
          class="flex justify-start items-center px-8 w-full h-24"
        >
          <A
            href="/"
            class="z-50 px-4 py-2 bg-slate-900 bg-opacity-60 rounded-lg transition-colors hover:bg-opacity-80"
          >
            Go back
          </A>
        </header>
        <div class="relative p-4 h-full">
          <div
            class="flex flex-col gap-12 justify-center items-center"
          >
            <div class="text-center">
              <h1
                class="text-3xl font-medium"
              >
                Games
              </h1>
              <p>Here you&apos;ll find fun games to fully play on your Launchpad, or games where you can use your Launchpad as a controller!</p>
            </div>
            <div
              class="max-w-[968px] grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <A
                href="/games/tictactoe"
                class="group p-4 rounded-lg w-full bg-slate-900 bg-opacity-20 shadow-slate-900/50 hover:bg-opacity-60 shadow-sm hover:shadow-lg transition cursor-pointer"
              >
                <h2
                  class="transition-colors text-slate-400 group-hover:text-slate-200 font-medium text-xl mb-2"
                >
                  Tic Tac Toe
                </h2>
                <p
                  class="transition-colors text-slate-400 text-opacity-60 group-hover:text-opacity-100"
                >
                  Play a game of Tic Tac Toe on your Launchpad!
                </p>
              </A>
              <A
                href="#"
                class="group p-4 rounded-lg w-full bg-slate-900 bg-opacity-20 shadow-slate-900/50 hover:bg-opacity-60 shadow-sm hover:shadow-lg transition cursor-pointer"
              >
                <h2
                  class="transition-colors text-slate-400 group-hover:text-slate-200 font-medium text-xl mb-2"
                >
                  More games coming soon!
                </h2>
                <p
                  class="transition-colors text-slate-400 text-opacity-60 group-hover:text-opacity-100"
                >
                  New games will be added in upcoming releases! (For status updates, you can check our Discord server or roadmap on GitHub)
                </p>
              </A>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamesHome;
