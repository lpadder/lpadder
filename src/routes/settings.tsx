import type { FlowComponent } from "solid-js";

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

const SettingsLayout: FlowComponent = (props) => {
  return (
    <>
      <Title>lpadder - settings</Title>
      <header class="h-16 bg-slate-900 w-full px-4 flex justify-between items-center">
        <A href="/">Go back to lpadder</A>
        <h1 class="text-xl">Settings</h1>
      </header>
      <nav class="py-2 flex gap-2 pl-4 overflow-x-scroll">
        <For each={settingsList}>
          {(setting) => (
            <div class="px-2 py-1 bg-slate-900">
              <A href={setting.link}>
                {setting.name}
              </A>
            </div>
          )}
        </For>
      </nav>

      <div class="mx-auto container p-4">
        {props.children}
      </div>
    </>
  );
};

export default SettingsLayout;
