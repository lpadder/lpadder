import * as ProjectsStore from "../../utils/projectsStore";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import NewProjectModal from "../../components/NewProjectModal";

export default function Projects () {
  const [projects, setProjects] = useState({});
  const [showNewProjectModal, setNewProjectModal] = useState(false);

  // Show stored projects from localforage
  // at component mount.
  useEffect(() => {
    (async () => {
      const savedProjects = await ProjectsStore.getProjects();
      setProjects(savedProjects);
    })();
  }, []);

  const closeNewProjectModal = async () => {
    const savedProjects = await ProjectsStore.getProjects();
    setProjects(savedProjects);
    
    setNewProjectModal(false);
  };

  const openNewProjectModal = () => {
    setNewProjectModal(true);
  }

  const deleteProject = async (slugName) => {
    await ProjectsStore.deleteProject(slugName);

    const savedProjects = await ProjectsStore.getProjects();
    setProjects(savedProjects);
  }

  return (
    <div>
      <h1>
        Projects
      </h1>

      <Link to="/">Home</Link>

      <NewProjectModal
        show={showNewProjectModal}
        closeModal={closeNewProjectModal}
      />

      <button
        onClick={openNewProjectModal}
      >
        Create a new one
      </button>

      {(Object.keys(projects).length > 0)
        ? Object.keys(projects).map(slugName =>
          <div key={slugName}>
            <h2>{projects[slugName].name}</h2>
            <p>Cover's author: {projects[slugName].author}</p>

            {/* Action buttons */}
            <button onClick={() => deleteProject(slugName)}>
              Delete {/* Show a warning modal. */}
            </button>
            <Link to={`/projects/${slugName}`}>
              <button>
                Open
              </button>
            </Link>
          </div>
        )
        : <div>
            No projects yet !
            <button
              onClick={openNewProjectModal}
            >
              Create a new one
            </button>
          </div>
      }
    </div>
  );
}
