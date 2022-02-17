import type {
  ProjectStoredStructure
} from "@/types/Project";
import { FormEvent, useState } from "react";

import stores from "../stores";
import Input from "./Input";

type CreateProjectModalProps = {
  allLocalProjects: ProjectStoredStructure[];
  setAllLocalProjects: React.Dispatch<
    React.SetStateAction<ProjectStoredStructure[] | null>
  >;

  closeModal: () => void;
};

export default function CreateProjectModal ({
  allLocalProjects,
  setAllLocalProjects,
  closeModal
}: CreateProjectModalProps) {
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
        ...allLocalProjects,
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
    <div
      className="flex fixed top-0 left-0 z-50 justify-center items-center w-screen h-screen bg-gray-900 bg-opacity-60"
    >
      <div className="flex justify-center items-center px-4 py-12 min-h-full sm:px-6 lg:px-8">
        <div className="px-8 py-4 space-y-8 w-full max-w-md bg-gray-900 rounded-lg">
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
        </div>
      </div>
    </div>
  );
}
