import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import stores from "../../../stores";

export default function ProjectPlay({ updateMenuComponents }) {
  const [projectState, setProjectState] = useState(null);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    (async () => {
      const project = await stores.projects.getProjectFromSlug(params.slug);
      
      // Check if project exists.
      if (!! project) {
        setProjectState(project);
        
        if (typeof updateMenuComponents === "function") {
          updateMenuComponents([
            <Link to={`${params.slug}/play`}>Switch play mode</Link>
          ])
        }
      }
      else {
        updateMenuComponents([]);
        navigate("/projects");
      }
    })();
  }, [])

  return (
    <div>
      <h1>Editor</h1>
      {JSON.stringify(projectState)}
    </div>
  );
}