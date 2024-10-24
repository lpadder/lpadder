import type { Component, JSX } from "solid-js";

import { DialogTitle } from "solid-headless";

import Modal from "@/components/Modal";
import Input from "@/components/Input";

import { modalsStore, setModalsStore } from "@/stores/modals";

import { generateProject } from "@/utils/projects";
import { devicesConfiguration, DeviceType } from "@/utils/devices";

const CreateProjectModal: Component = () => {
  const navigate = useNavigate();
  const [deviceToAdd, setDeviceToAdd] = createSignal<DeviceType>(DeviceType.LAUNCHPAD_MK2);

  const [state, setState] = createStore({
    name: "",
    slug: "",
    // a list of devices we have by default in the project.
    // we keep the device type to differentiate the devices.
    devices: [] as Array<DeviceType>
  });

  const handleCreation: JSX.EventHandler<HTMLFormElement, Event> = async (event) => {
    event.preventDefault();

    if (!state.name || !state.slug) return;
    await generateProject(state.slug, state.name, state.devices);

    navigate(`/projects/${state.slug}`);
    resetAndClose();
  };

  /** We reset the values and close modal. */
  const resetAndClose = () => {
    setState({
      slug: "",
      name: "",
      devices: []
    });

    setModalsStore({ createProjectModal: false });
  };


  return (
    <Modal open={modalsStore.createProjectModal} onClose={resetAndClose}>
      <div class="p-4 pb-0">
        <DialogTitle as="h2" class="mb-2 text-2xl font-bold text-slate-200">
          Create a project
        </DialogTitle>
        <p class="text-slate-400 text-sm">
          This is the project creation process.
          You can easily set-up a project by filling out this form.
        </p>

        <form onSubmit={handleCreation}>
          <div class="text-center mt-6 mb-4 mx-auto w-full">
            <h4 class="bg-slate-900 inline-block px-4 py-1 rounded-md text-lg">Global informations</h4>
          </div>

          <div class="space-y-2">
            <Input
              autocomplete="off"
              class="border border-slate-900 hover:bg-opacity-60 focus:border-fuchsia-400"
              label="Personal slug"
              placeholder="some-amazing-project"
              tip="Slug used to identify the project more easily from URL."
              onInput={(e) => {
                const cleanedValue = e.currentTarget.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
                return setState({ ...state, slug: cleanedValue });
              }}
              value={state.slug}
              required
            />

            <Input
              autocomplete="off"
              class="border border-slate-900 hover:bg-opacity-60 focus:border-fuchsia-400"
              label="Cover's name"
              placeholder="Author - Title (Launchpad Cover)"
              onChange={(e) => setState({ ...state, name: e.currentTarget.value })}
              value={state.name}
              required
            />
          </div>

          <div class="text-center mt-6 mb-4 mx-auto w-full">
            <h4 class="bg-slate-900 inline-block px-4 py-1 rounded-md text-lg">MIDI set-up</h4>
          </div>

          <div class="flex gap-4">
            <select
              class={`
                py-2 px-4 w-full rounded-lg outline-none
                bg-slate-900 bg-opacity-40
                transition-colors focus:bg-opacity-100 border border-slate-900
                hover:bg-opacity-60 focus:border-fuchsia-400
              `}
              onChange={(event) => setDeviceToAdd(event.currentTarget.value as DeviceType)}
            >
              <For each={Object.values(DeviceType)}>
                {(type) => (
                  <option
                    value={type}
                    selected={deviceToAdd() === type}
                  >
                    {devicesConfiguration[type].name}
                  </option>
                )}
              </For>
            </select>

            <button
              type="button"
              class="px-4 py-2 w-fit text-sm font-medium text-fuchsia-400 bg-fuchsia-800 bg-opacity-40 rounded-md transition-colors hover:bg-opacity-60 focus:bg-opacity-70"
              onClick={() => setState("devices", (prev) => [...prev, deviceToAdd()])}
            >
              Add
            </button>
          </div>

          <div class="flex flex-wrap my-4 gap-2">
            <For each={state.devices}>
              {(device, index) => (
                <button
                  type="button"
                  class="text-sm truncate py-1.5 px-3 border border-slate-6 bg-slate-9 bg-opacity-20 hover:bg-opacity-40 hover:border-slate-5 transition-colors cursor-pointer rounded"
                  onClick={() => setState("devices", (prev) => prev.filter((_, current) => current !== index()))}
                >
                  {index() + 1}. {device}
                </button>
              )}
            </For>
          </div>

          <div class="flex gap-2 justify-between pt-6">
            <button
              type="button"
              class="px-4 py-2 w-full text-sm font-medium text-slate-400 text-opacity-60 transition-colors hover:text-opacity-80"
              onClick={resetAndClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 w-full text-sm font-medium text-fuchsia-400 bg-fuchsia-800 bg-opacity-40 rounded-md transition-colors hover:bg-opacity-60 focus:bg-opacity-70"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateProjectModal;
