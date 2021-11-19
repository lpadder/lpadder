import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import { getProject } from "../../../utils/projectsStore";

import ProjectNavBar from "../../../components/ProjectNavigation";

export default function ProjectInformations() {
  const history = useHistory();
  const { projectSlugName } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState(null);

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
