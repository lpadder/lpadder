import type { LpadderProject } from "../../../types/LpadderProjects";

import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";

import { getProject } from "../../../utils/projectsStore";

import { Button } from "../../../components/Button";
import ProjectNavBar from "../../../components/ProjectNavigation";

export default function ProjectInformations() {
  const history = useHistory();
  const { projectSlugName } = useParams<{
    projectSlugName: string;
  }>();

  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<LpadderProject | null>(null);

  /**
   * We get the current project.
   */
  useEffect(() => {
    getProject(projectSlugName)
    .then((project) => {
      if (project) {
        setProject(project);
        setIsLoading(false);
        console.log(project);
      }
      else {
        history.push("/projects");
      }
    });
  }, []);

  return (
    <div>
      <ProjectNavBar />
      <h1>Informations</h1>
      <h2>{project?.name} ({projectSlugName})</h2>
      <p>This project has been made by {project?.author}.</p>
    </div>
  );
}