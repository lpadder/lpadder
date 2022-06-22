import Input from "./Input";
import Modal from "@/components/Modal";

import { modalsStore, setModalsStore } from "@/stores/modals";
import { createNewProject } from "@/utils/covers";

export default function ImportProjectModal () {
  const [slug, setSlug] = createSignal("");

  const handleCreation = async (e: Event) => {
    e.preventDefault();

    if (!slug() || !modalsStore.importProjectModalData) return;
    
    const response = await createNewProject(slug(), modalsStore.importProjectModalData); 
    if (!response.success) {
      alert(response.message);
      return;
    }

    resetAndClose();
  };

  /** We reset the values and close modal. */
  const resetAndClose = () => {
    setSlug("");

    setModalsStore({
      importProjectModalData: null,
      importProjectModal: false
    });
  };

  return (
    <Modal open={modalsStore.importProjectModal} onClose={resetAndClose}>
      <h2 class="mt-6 text-3xl font-medium text-center text-gray-200">
        Import a cover
      </h2>
      <p class="mt-4 px-4 py-2 mx-4 text-opacity-40 bg-blue-800 bg-opacity-20 rounded-lg">
        You are currently importing <span class="font-medium text-blue-400">
          {modalsStore.importProjectModalData ? modalsStore.importProjectModalData.metadata.name : ""}
        </span> project.
      </p>

      <form class="mt-6 space-y-6 mx-4" onSubmit={handleCreation}>
        <Input
          autocomplete="off"
          class="border border-gray-900 hover:bg-opacity-60 focus:border-blue-400"
          label="Personal slug"
          placeholder="some-amazing-cover"
          tip="Slug used to identify the cover more easily from URL."
          value={slug()}
          onInput={evt => {
            /** We clean the string so it corresponds to a real slug. */
            const cleanedValue = evt.currentTarget.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
            setSlug(cleanedValue);
          }}
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
            class="px-4 py-2 w-full text-sm font-medium text-blue-400 bg-blue-800 bg-opacity-40 rounded-md transition-colors hover:bg-opacity-60 focus:bg-opacity-70"
          >
            Import
          </button>
        </div>
      </form>
    </Modal>
  );
}