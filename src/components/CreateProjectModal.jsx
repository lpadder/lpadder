import stores from "../stores";
import { useState } from "react";

const defaultState = {
  name: "",
  slug: "",
  authors: [],
  launchpadders: []
};

export default function CreateProjectModal ({ reloadSavedProjects, closeModal }) {
  const [state, setState] = useState(defaultState);

  const handleCreation = async () => {
    const [success, message] = await createEmptyProject({
      name: state.name,
      slug: state.slug,
      authors: state.authors,
      launchpadders: state.launchpadders
    });

    if (success) {
      await reloadSavedProjects();

      // Reset state to default values.
      setState(defaultState);
      closeModal();
    }
    else {
      console.error(message);
    }
  }

  // Short-hand to update state with text input.
  const updateTextInput = (key) => ({ target: { value } }) => setState({ ...state, [key]: value });

  return (
    <div
      className="
        z-50 fixed h-screen w-screen top-0 left-0
        flex justify-center items-center
        bg-gray-900 bg-opacity-60
      "
    >
      <div
        className="
          px-6 py-4 w-64 
          bg-gray-800
        "
      >
        <h2>Create a new cover</h2>

        <input value={state.name} onChange={updateTextInput("name")} placeholder="Cover's name" />
        <input value={state.slug} onChange={updateTextInput("slug")} placeholder="Personnal slug" />

        <button onClick={closeModal}>Cancel</button>
        <button onClick={handleCreation}>Save</button>
      </div>
    </div>
  )
}
