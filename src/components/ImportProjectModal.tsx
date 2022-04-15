import {
  FormEvent,
  useState
} from "react";

import Input from "./Input";
import Modal from "@/components/Modal";

import { useModalsStore } from "@/stores/modals";
import {
  storedProjectsData
} from "@/stores/projects_data";

import {
  storedProjectsMetadata,
  useLocalProjectsStore
} from "@/stores/projects_metadata";

export default function ImportProjectModal () {
  const [slug, setSlug] = useState("");

  const modal = useModalsStore(state => ({
    data: state.importProjectModalData,
    visibility: state.importProjectModal,

    setVisibility: state.setImportProjectModal,
    setData: state.setImportProjectModalData
  }));

  const {
    localProjectsMetadata,
    setLocalProjectsMetadata
  } = useLocalProjectsStore();

  const handleCreation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verify slug state.
    if (!slug || !modal.data || !localProjectsMetadata) return;
    
    // Save the data in localForage.
    await storedProjectsData.updateProjectData(slug, modal.data.data);

    // Save the metadata in localForage.
    await storedProjectsMetadata.updateProjectMetdata(slug, modal.data.metadata);

    // If succeed, we update the all local projects.
    setLocalProjectsMetadata([
      ...localProjectsMetadata,
      {
        slug,
        metadata: modal.data.metadata
      }
    ]);

    resetAndClose();
  };

  /** We reset the values and close modal. */
  const resetAndClose = () => {
    setSlug("");

    modal.setData(null);
    modal.setVisibility(false);
  };

  return (
    <Modal open={modal.visibility} onClose={resetAndClose}>
      <h2 className="mt-6 text-3xl font-medium text-center text-gray-200">
        Import a cover
      </h2>
      <p className="mt-4 px-4 py-2 mx-4 text-opacity-40 bg-blue-800 bg-opacity-20 rounded-lg">
        You are currently importing <span className="font-medium text-blue-400">
          {modal.data ? modal.data.metadata.name : ""}
        </span> project.
      </p>

      <form className="mt-6 space-y-6 mx-4" onSubmit={handleCreation}>
        <Input
          className="border border-gray-900 hover:bg-opacity-60 focus:border-blue-400"
          labelName="Personal slug"
          placeholder="some-amazing-cover"
          smallTipText="Slug used to identify the cover more easily from URL."
          onChange={(e) => {
            const cleanedValue = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
            setSlug(cleanedValue);
          }}
          value={slug}
        />

        <div className="flex gap-2 justify-between">
          <button
            type="button"
            className="px-4 py-2 w-full text-sm font-medium text-gray-400 text-opacity-60 transition-colors hover:text-opacity-80"
            onClick={resetAndClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 w-full text-sm font-medium text-blue-400 bg-blue-800 bg-opacity-40 rounded-md transition-colors hover:bg-opacity-60 focus:bg-opacity-70"
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}