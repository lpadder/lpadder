import type { Component } from "solid-js";
import LpadderLogo from "@/assets/icon.png";

const SubMenu: Component<{
  title: string,
  description: string,
  href: string
}> = (props) => {
  return (
    <A href={props.href} class="w-full max-w-80 sm:w-96">
      <div class="p-4 bg-slate-500 bg-opacity-40 rounded-md backdrop-filter backdrop-blur transition-colors hover:bg-opacity-60">
        <h2 class="text-xl font-medium text-sky-50">{props.title}</h2>
        <p class="font-thin text-sky-100 opacity-80">{props.description}</p>
      </div>
    </A>
  );
};

const Home: Component = () => {
  return (
    <div class="flex flex-col justify-between p-8 min-h-screen bg-bottom bg-no-repeat bg-contain bg-[url(/src/assets/backgrounds/home-mobile.svg)] sm:bg-[url(/src/assets/backgrounds/home-desktop.svg)] sm:bg-right">
      <header>
        <nav class="flex flex-row justify-center w-full mb-12 bg-transparent sm:justify-start">
          <img class="w-24 h-24" alt="lpadder's logo" src={LpadderLogo} />
        </nav>

        <div class="flex flex-col flex-wrap gap-4 h-full items-center sm:items-start">
          <SubMenu
            title="Projects"
            description="Take a look at your saved projects !"
            href="/projects"
          />

          <SubMenu
            title="Utilities"
            description="Want to do some crazy stuff ?"
            href="/utilities"
          />

          <SubMenu
            title="Games"
            description="If you're bored..."
            href="/games"
          />

          <SubMenu
            title="Settings"
            description="Custom the behaviour of lpadder."
            href="/settings"
          />
        </div>
      </header>

      <footer class="flex flex-col mt-12 justify-start sm:justify-center items-center sm:items-start w-full sm:left-auto sm:w-auto">
        <p class="text-opacity-60">Version: <span class="font-medium">
          <Show when={!import.meta.env.DEV} fallback="next">{APP_VERSION}</Show>
        </span></p>
        <p class="text-slate-200 text-opacity-80">
          Made with ❤️ by {" "}
          <a
            href="https://github.com/Vexcited"
            target="_blank"
            rel="noreferrer noopener"
            class="text-slate-200 text-opacity-90 hover:text-opacity-100"
          >
            Vexcited
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
