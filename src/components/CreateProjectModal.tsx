import {
  FormEvent,
  useState
} from "react";

import Modal from "@/components/Modal";
import Input from "@/components/Input";

import {
  useModalsStore
} from "@/stores/modals";

import {
  storedProjectsData  
} from "@/stores/projects_data";

import {
  storedProjectsMetadata,
  useLocalProjectsStore
} from "@/stores/projects_metadata";

export default function CreateProjectModal () {
  const [state, setState] = useState({
    name: "",
    slug: ""
  });

  const modal = useModalsStore(state => ({
    visibility: state.createProjectModal,
    setVisibility: state.setCreateProjectModal
  }));

  const {
    localProjectsMetadata,
    setLocalProjectsMetadata
  } = useLocalProjectsStore();

  const handleCreation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!state.name || !state.slug || !localProjectsMetadata) return;
    
    // We create an empty project in localForage.
    const created_project_metadata = await storedProjectsMetadata.createEmptyProjectMetdata(state.slug, {
      name: state.name
    });
    
    if (!created_project_metadata.success)
      return console.error("[CreateProjectModal]", created_project_metadata.message);
      
    const created_project_data = await storedProjectsData.createEmptyProjectData(state.slug);
      
    if (!created_project_data.success)
      return console.error("[CreateProjectModal]", created_project_data.message);

    setLocalProjectsMetadata([
      ...localProjectsMetadata,
      {
        slug: created_project_metadata.data.slug,
        metadata: created_project_metadata.data.metadata
      }
    ]);
    
    resetAndClose();
  };

  /** We reset the values and close modal. */
  const resetAndClose = () => {
    setState({
      slug: "",
      name: ""
    });
    
    modal.setVisibility(false);
  };

  return (
    <Modal open={modal.visibility} onClose={resetAndClose}>
      <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-200">
        Create a cover
      </h2>

      <form className="px-4 mt-8 space-y-6" onSubmit={handleCreation}>
        <Input
          className="border border-gray-900 hover:bg-opacity-60 focus:border-pink-400"
          labelName="Cover's name"
          placeholder="Author - Title (Launchpad Cover)"
          onChange={(e) => setState({ ...state, name: e.target.value })}
          value={state.name}
        />

        <Input
          className="border border-gray-900 hover:bg-opacity-60 focus:border-pink-400"
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
            onClick={resetAndClose}
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
