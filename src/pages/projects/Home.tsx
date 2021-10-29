import type { LpadderProject } from "../../types/LpadderProject";

import ProjectsStore from "../../utils/projectsStore";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProjectsHome () {
  const [projects, setProjects] = useState<LpadderProject[]>([]);
  const projectsStore = new ProjectsStore();

  // Store saved projects in localforage.
  useEffect(() => {
    (async () => {
      const savedProjects = await projectsStore.getProjects();
      setProjects(savedProjects);
    })();
  }, []);

  const handleNewProject = async () => {
    const updatedProjects = await projectsStore.newProject({
      name: "New Project",
      author: "Undefined"
    });

    setProjects([...updatedProjects]);
  }

  return (
    <div>
      <h1>
        Projects
      </h1>

      <Link to="/">Home</Link>

      <button
        onClick={handleNewProject}
      >
        Create a new one
      </button>

      {projects.length > 0
        ? projects.map((project, key) =>
          <div key={key}>
            {key}: {project.name} - {project.author}
          </div>
        )
        : <div>
            No projects yet !
            <button
              onClick={handleNewProject}
            >
              Create a new one
            </button>
          </div>
      }
    </div>
  );
}
