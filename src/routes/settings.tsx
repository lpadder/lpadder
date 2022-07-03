import type { Component } from "solid-js";

const settingsList = [
  {
    name: "Globals",
    link: "globals"
  },
  {
    name: "MIDI",
    link: "midi"
  }
];

const SettingsLayout: Component = () => {

  return (
    <>
      <Title>lpadder - settings</Title>
      <header class="h-16 bg-gray-900 w-full px-4 flex justify-between items-center">
        <Link href="/">Go back to lpadder</Link>
        <h1 class="text-xl">Settings</h1>
      </header>
      <nav class="py-2 flex gap-2 pl-4 overflow-x-scroll">
        <For each={settingsList}>
          {setting => (
            <div class="px-2 py-1 bg-gray-900">
              <Link href={setting.link}>
                {setting.name}
              </Link>
            </div>
          )}
        </For>
      </nav>

      <div class="p-4">


        <Outlet />
      </div>
    </>
  );
};

export default SettingsLayout;
