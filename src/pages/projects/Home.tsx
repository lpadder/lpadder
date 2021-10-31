import type { StoredProjects } from "../../types/LpadderProjects";

import * as ProjectsStore from "../../utils/projectsStore";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProjectsHome () {
  const [projects, setProjects] = useState<StoredProjects>({});

  // Store saved projects in localforage.
  useEffect(() => {
    (async () => {
      const savedProjects = await ProjectsStore.getProjects();
      setProjects(savedProjects);
    })();
  }, []);

  const handleNewProject = async () => {
    const slugName = "undefined";
    const project = {
      name: "New Project",
      author: "Undefined"
    };

    await ProjectsStore.setProject(slugName, project);

    setProjects({
      ...projects,
      [slugName]: project
    });
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

      {(Object.keys(projects).length > 0)
        ? Object.keys(projects).map(slugName =>
          <div key={slugName}>
            {slugName}: {projects[slugName].name} - {projects[slugName].author}
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
