import { Link } from "react-router-dom";
import localforage from "localforage";
import { useState, useEffect } from "react";

import type { LpadderProject } from "../../types/LpadderProject";

export default function ProjectsHome () {
  const [projects, setProjects] = useState<LpadderProject[]>([]);

  useEffect(() => {
    (async () => {
      const savedProjects = await localforage.getItem("projects");
      console.log(savedProjects);

      // TODO
      setProjects([]);
    })();
  }, []);

  return (
    <div>
      <h1>
        Projects
      </h1>

      <Link to="/">Home</Link>

      {projects.map((project, key) =>
        <div key={key}>
          {project.author} - {project.name}
        </div>
      )}
    </div>
  );
}
