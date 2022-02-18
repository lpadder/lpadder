import type {
  ProjectStoredStructure,
  ProjectStructure
} from "@/types/Project";
import { FormEvent, useState } from "react";

import stores from "../stores";
import Input from "./Input";

type ImportProjectModalProps = {
  projectToImport: ProjectStructure;
  setProjectToImport: React.Dispatch<
    React.SetStateAction<ProjectStructure | null>
  >;

  allLocalProjects: ProjectStoredStructure[];
  setAllLocalProjects: React.Dispatch<
    React.SetStateAction<ProjectStoredStructure[] | null>
  >;

  closeModal: () => void;
};

export default function ImportProjectModal ({
  projectToImport,
  setProjectToImport,

  allLocalProjects,
  setAllLocalProjects,

  closeModal
}: ImportProjectModalProps) {
  const [slug, setSlug] = useState("");

  const handleCreation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verify slug state.
    if (!slug) return;
    
    const [success, message, project] = await stores.projects.updateProject(
      slug, projectToImport
    );

    if (success && project) {
      setAllLocalProjects([
        ...allLocalProjects,
        {
          slug,
          data: project
        }
      ]);

      // Clear unused value.
      setProjectToImport(null);
      closeModal();
    }
    else {
      console.error(`[ImportProjectModal] ${message}`);
    }
  };

  return (
    <div
      className="flex fixed top-0 left-0 z-50 justify-center items-center w-screen h-screen bg-gray-900 bg-opacity-60"
    >
      <div className="flex justify-center items-center px-4 py-12 min-h-full sm:px-6 lg:px-8">
        <div className="px-8 py-4 space-y-8 w-full max-w-md bg-gray-900 rounded-lg">
          <h2 className="mt-6 text-3xl font-medium text-center text-gray-200">
            Import a cover
          </h2>
          <p className="px-4 py-2 text-opacity-40 bg-pink-800 bg-opacity-20 rounded-lg">
            You are currently importing <span className="font-medium text-pink-400">{projectToImport.name}</span> project.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleCreation}>
            <Input
              labelName="Personal slug"
              placeholder="some-amazing-cover"
              smallTipText="Slug used to identify the cover more easily from URL."
              onChange={(e) => {
                const cleanedValue = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
                return setSlug(cleanedValue);
              }}
              value={slug}
            />

            <div className="flex gap-2 justify-between">
              <button
                type="button"
                className="px-4 py-2 w-full text-sm font-medium text-gray-400 text-opacity-60 transition-colors hover:text-opacity-80"
                onClick={() => {
                  // Clean values before closing modal.
                  setProjectToImport(null);
                  closeModal();
                }}
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