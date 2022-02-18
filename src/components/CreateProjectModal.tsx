import type {
  ProjectStoredStructure
} from "@/types/Project";
import { FormEvent, useState } from "react";

import stores from "../stores";
import Input from "./Input";

import { useProjectsStore } from "@/pages/projects";
import Modal from "@/components/Modal";

type CreateProjectModalProps = {
  open: boolean;
  closeModal: () => void;
};

export default function CreateProjectModal ({
  open, closeModal
}: CreateProjectModalProps) {
  const allLocalProjects = useProjectsStore(state => state.allLocalProjects);
  const setAllLocalProjects = useProjectsStore(state => state.setAllLocalProjects);

  const [state, setState] = useState({
    name: "",
    slug: ""
  });

  const handleCreation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verify states.
    if (!state.name || !state.slug) return;
    
    const [success, message, project] = await stores.projects.createEmptyProject({
      name: state.name,
      slug: state.slug
    });

    if (success && project) {
      setAllLocalProjects([
        ...allLocalProjects as ProjectStoredStructure[],
        {
          slug: state.slug,
          data: project
        }
      ]);
      
      closeModal();
    }
    else {
      console.error(`[CreateProjectModal] ${message}`);
    }
  };

  return (
    <Modal open={open} onClose={closeModal}>
      <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-200">
            Create a cover
      </h2>

      <form className="mt-8 space-y-6" onSubmit={handleCreation}>
        <Input
          labelName="Cover's name"
          placeholder="Author - Title (Launchpad Cover)"
          onChange={(e) => setState({ ...state, name: e.target.value })}
          value={state.name}
        />
        <Input
          labelName="Personal slug"
          placeholder="some-amazing-cover"
          smallTipText="Slug used to identify the cover more easily from URL."
          onChange={(e) => {
            const cleanedValue = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
            return setState({ ...state, slug: cleanedValue });
          }}
          value={state.slug}
        />

        <div className="flex gap-2 justify-between">
          <button
            type="button"
            className="px-4 py-2 w-full text-sm font-medium text-gray-400 text-opacity-60 transition-colors hover:text-opacity-80"
            onClick={closeModal}
          >
                Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 w-full text-sm font-medium text-pink-400 bg-pink-800 bg-opacity-40 rounded-md transition-colors hover:bg-opacity-60 focus:bg-opacity-70"
          >
                Create
          </button>
        </div>
      </form>
    </Modal>
  );
}
