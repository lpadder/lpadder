import type { Component, JSX } from "solid-js";

import { DialogTitle } from "solid-headless";

import Modal from "@/components/Modal";
import Input from "@/components/Input";

import { modalsStore, setModalsStore } from "@/stores/modals";

import { createNewProject } from "@/utils/projects";

const CreateProjectModal: Component = () => {
  const navigate = useNavigate();
  const [state, setState] = createStore({
    name: "",
    slug: ""
  });

  const handleCreation: JSX.EventHandler<HTMLFormElement, Event> = async (event) => {
    event.preventDefault();
    if (!state.name || !state.slug) return;

    const response = await createNewProject(state.slug, state.name);
    if (!response.success) return;

    navigate(`/projects/${state.slug}`);
    resetAndClose();
  };

  /** We reset the values and close modal. */
  const resetAndClose = () => {
    setState({
      slug: "",
      name: ""
    });

    setModalsStore({ createProjectModal: false });
  };

  return (
    <Modal open={modalsStore.createProjectModal} onClose={resetAndClose}>
      <DialogTitle as="h2" class="mt-6 text-3xl font-extrabold text-center text-gray-200">
        Create a project
      </DialogTitle>

      <form class="px-4 mt-8 space-y-6" onSubmit={handleCreation}>
        <Input
          autocomplete="off"
          class="border border-gray-900 hover:bg-opacity-60 focus:border-pink-400"
          label="Cover's name"
          placeholder="Author - Title (Launchpad Cover)"
          onChange={(e) => setState({ ...state, name: e.currentTarget.value })}
          value={state.name}
        />

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
        />

        <div class="flex gap-2 justify-between">
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
    </Modal>
  );
};

export default CreateProjectModal;
