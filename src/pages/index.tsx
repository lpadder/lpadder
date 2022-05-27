import type { Component } from "solid-js";

import { Show } from "solid-js";
import { Link } from "solid-app-router";
import LpadderLogo from "@/assets/icon.png";

const SubMenu: Component<{
  title: string,
  description: string,
  href: string
}> = (props) => {
  return (
    <Link href={props.href} class="flex-1">
      <div class="p-4 bg-gray-500 bg-opacity-40 rounded-md backdrop-filter backdrop-blur transition-colors hover:bg-opacity-60">
        <h2 class="text-xl font-medium text-blue-50">{props.title}</h2>
        <p class="font-thin text-blue-100 opacity-80">{props.description}</p>
      </div>
    </Link>
  );
};

export default function Home () {
  return (
    <div class="p-8 w-screen h-screen bg-bottom bg-no-repeat bg-contain bg-home-mobile sm:bg-home-desktop sm:bg-right">

      <nav class="flex flex-row justify-center w-full h-36 bg-transparent sm:justify-start">
        <img class="w-24 h-24" alt="lpadder's logo" src={LpadderLogo} />
      </nav>

      <div class="flex flex-col flex-wrap gap-4 items-center sm:items-start">
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
      </div>

      <footer class="flex flex-col fixed bottom-0 left-0 justify-start sm:justify-center items-center sm:items-start w-full h-24 sm:left-auto sm:w-auto">
        <p class="text-opacity-60">Version: <span class="font-medium">
          <Show when={import.meta.env.DEV} fallback={APP_VERSION}>{"next"}</Show>
        </span></p>
        <p class="text-gray-200 text-opacity-80">
          Made with ❤️ by {" "}
          <a
            href="https://github.com/Vexcited"
            target="_blank"
            rel="noreferrer noopener"
            class="text-gray-200 text-opacity-90 hover:text-opacity-100"
          >
            Vexcited
          </a>
        </p>
      </footer>
    </div>
  );
}
