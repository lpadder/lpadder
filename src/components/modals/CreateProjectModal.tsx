import type { Component, JSX } from "solid-js";

import { DialogTitle } from "solid-headless";

import Modal from "@/components/Modal";
import Input from "@/components/Input";

import { modalsStore, setModalsStore } from "@/stores/modals";
import { webMidiDevices } from "@/stores/webmidi";

import { createNewProject } from "@/utils/projects";

const CreateProjectModal: Component = () => {
  const navigate = useNavigate();
  const usableDevices = () => webMidiDevices().filter(device => device.enabled && typeof device.type !== "undefined");

  const [state, setState] = createStore<{
    name: string,
    slug: string,
    selected_devices: { [raw_name: string]: boolean }
  }>({
    name: "",
    slug: "",
    selected_devices: {}
  });

  const handleCreation: JSX.EventHandler<HTMLFormElement, Event> = async (event) => {
    event.preventDefault();
    if (!state.name || !state.slug) return;

    /** Get the selected devices with full informations. */
    const devices = webMidiDevices().filter(device => state.selected_devices[device.raw_name]);

    const response = await createNewProject(state.slug, {
      importing: false,
      project: {
        name: state.name,
        devices
      }
    });

    if (!response.success) return;

    navigate(`/projects/${state.slug}`);
    resetAndClose();
  };

  /** We reset the values and close modal. */
  const resetAndClose = () => {
    setState({
      slug: "",
      name: "",
      selected_devices: {}
    });

    setModalsStore({ createProjectModal: false });
  };

  return (
    <Modal open={modalsStore.createProjectModal} onClose={resetAndClose}>
      <div class="p-4 pb-0">
        <DialogTitle as="h2" class="mb-2 text-2xl font-bold text-gray-200">
          Create a project
        </DialogTitle>
        <p class="text-gray-400 text-sm">
          This is the project creation process.
          You can easily set-up a project by filling out this form.
        </p>

        <form onSubmit={handleCreation}>
          <div class="text-center mt-6 mb-4 mx-auto w-full">
            <h4 class="bg-gray-900 inline-block px-4 py-1 rounded-md text-lg">Global informations</h4>
          </div>

          <div class="space-y-2">
            <Input
              autocomplete="off"
              class="border border-gray-900 hover:bg-opacity-60 focus:border-pink-400"
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
              class="border border-gray-900 hover:bg-opacity-60 focus:border-pink-400"
              label="Cover's name"
              placeholder="Author - Title (Launchpad Cover)"
              onChange={(e) => setState({ ...state, name: e.currentTarget.value })}
              value={state.name}
              required
            />
          </div>

          <div class="text-center mt-6 mb-4 mx-auto w-full">
            <h4 class="bg-gray-900 inline-block px-4 py-1 rounded-md text-lg">MIDI set-up</h4>
          </div>

          <Show when={usableDevices().length > 0} fallback={
            <p class="text-center text-xs p-2 bg-gray-700">
              No MIDI device to set-up. <br />
              Check if you've connected a MIDI device.
            </p>
          }>
            <p>
              Should we automatically set-up these devices in the project for you ?
            </p>

            <div class="flex flex-wrap justify-evenly my-4 gap-2">
              <For each={usableDevices()}>
                {device => (
                  <button
                    type="button"
                    class="text-sm h-26 w-26 p-2 border border-pink-500 bg-pink-500 transition-colors cursor-pointer rounded"
                    onClick={() => setState("selected_devices", device.raw_name, (prev) => !prev)}
                    classList={{
                      "bg-opacity-100 hover:bg-opacity-95": state.selected_devices[device.raw_name],
                      "bg-opacity-20 hover:bg-opacity-40 text-pink-200": !state.selected_devices[device.raw_name]
                    }}
                  >
                    {device.name}
                  </button>
                )}
              </For>
            </div>
          </Show>

          <div class="flex gap-2 justify-between pt-6">
            <button
              type="button"
              class="px-4 py-2 w-full text-sm font-medium text-gray-400 text-opacity-60 transition-colors hover:text-opacity-80"
              onClick={resetAndClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 w-full text-sm font-medium text-pink-400 bg-pink-800 bg-opacity-40 rounded-md transition-colors hover:bg-opacity-60 focus:bg-opacity-70"
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
