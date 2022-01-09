import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import stores from "../../../stores";

export default function ProjectPlay() {
  const [projectState, setProjectState] = useState(null);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    (async () => {
      const project = await stores.projects.getProjectFromSlug(params.slug);

      // Check if project exists.
      if (!! project) {
        setProjectState(project);
      }
      else {
        navigate("/projects");
      }
    })();
  }, [])

  return (
    <div>
      <h1>Play</h1>
      {JSON.stringify(projectState)}
    </div>
  );
}