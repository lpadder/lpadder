import React, { useState } from "react";
import styles from "./index.module.scss";

import { setProject, getProject } from "../../utils/projectsStore";

export default function NewProjectModal ({
  show,
  closeModal
}: {
  show: boolean;
  closeModal: () => Promise<void>;
}) {
  const [slugName, setSlugName] = useState("");
  const [author, setAuthor] = useState("");
  const [name, setName] = useState("");

  const handleConfirm = async (
    e: React.FormEvent<HTMLFormElement> |
    React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const project = await getProject(slugName);

    if (!project) {
      await setProject(slugName, {
        name,
        author
      });
    }

    // Close modal.
    closeModal();

    // Reset the slug name.
    setSlugName("");
    setName("");
  };

  // If the modal is not showing, don't render anything.
  if (!show) return null;

  return (
    <React.Fragment>
      <div className={styles.modalContainer}>
        <div className={styles.modalBlock}>
          <h1>Create a new project</h1>
          <p>
            Here you'll be able to configure your project to your needs.
          </p>

          <form onSubmit={handleConfirm}>
            <input
              type="text"
              placeholder="slug-name"

              value={slugName}
              onChange={(e) => setSlugName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Project's name !"

              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <input
              type="text"
              placeholder="Project's author !"

              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />

            <button onClick={handleConfirm}>
              Create !
            </button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}