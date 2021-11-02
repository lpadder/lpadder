import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { LpadderProject } from "../../../types/LpadderProjects";

import { getProject } from "../../../utils/projectsStore";

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
      <h1>Informations</h1>
    </div>
  );
}