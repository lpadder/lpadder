import { useState, useEffect } from "react";
import { Routes, Route, useParams, useNavigate, Link, Navigate } from "react-router-dom";
import stores from "../../../stores";

// Pages
import ProjectPlay from "./play";
import ProjectEdit from "./edit";

export default function ProjectOverview ({ updateMenuComponents }) {
  const [projectState, setProjectState] = useState(null);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    (async () => {
      console.log(params);
      const project = await stores.projects.getProjectFromSlug(params.slug);
      const currentMode = params["*"];

      // Check if project exists.
      if (!! project) {
        setProjectState(project);
        
        if (typeof updateMenuComponents === "function") {
          const switchModePath = currentMode === "edit" ? "play" : "edit";
          updateMenuComponents([
            <Link to={`${params.slug}/${switchModePath}`}>Overview Mode</Link>
          ])
        }
      }
      else {
        updateMenuComponents([]);
        navigate("/projects");
      }
    })();
  }, []);

  console.log(projectState);

  // Show a loader while loading
  // and checking the project. 
  if (!projectState) return <p>Loading...</p>; 

  // Show the complete UI with routes.
  return (
    <div className="p-4">
      <h1 className="font-medium text-lg">{projectState.name}</h1>
      {JSON.stringify(projectState)}

      <Routes>
        <Route path="play" element={<ProjectPlay data={projectState} />} />
        <Route path="edit" element={<ProjectEdit data={projectState} />} />
        
        <Route path="*" element={<Navigate to="play" />} />
      </Routes>
    </div>
  );
}