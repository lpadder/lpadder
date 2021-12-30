export default function CreateProjectModal ({ reloadSavedProjects, closeModal }) {

  const handleCreation = async () => {
    await reloadSavedProjects();
    closeModal();
  }

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

        <button onClick={closeModal}>Cancel</button>
        <button onClick={handleCreation}>Save</button>
      </div>
    </div>
  )
}