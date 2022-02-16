import { FormEvent, useState } from "react";

import stores from "../stores";
import Input from "./Input";

type CreateProjectModalProps = {
  reloadSavedProjects: () => Promise<void>;
  closeModal: () => void;
};

export default function CreateProjectModal ({
  reloadSavedProjects,
  closeModal
}: CreateProjectModalProps) {
  const [state, setState] = useState({
    name: "",
    slug: ""
  });

  const handleCreation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!state.name || !state.slug) return;
    
    const [success, message] = await stores.projects.createEmptyProject({
      name: state.name,
      slug: state.slug
    });

    if (success) {
      await reloadSavedProjects();
      closeModal();
    }
    else {
      console.error(`[CreateProjectModal] ${message}`);
    }
  };

  return (
    <div
      className="
        z-50 fixed h-screen w-screen top-0 left-0
        flex justify-center items-center
        bg-gray-900 bg-opacity-60
      "
    >
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-gray-900 px-8 py-4 rounded-lg">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-200">
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
                className="
                  w-full py-2 px-4 
                  text-sm font-medium
                  text-gray-400 text-opacity-60
                  hover:text-opacity-80 transition-colors
                "
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="
                  w-full py-2 px-4
                  text-sm font-medium
                  rounded-md
                  text-pink-400
                  bg-pink-800 bg-opacity-40
                  hover:bg-opacity-60 transition-colors
                  focus:bg-opacity-70
                "
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
