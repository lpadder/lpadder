import type {
  ProjectStructure
} from "@/types/Project";

import React, {
  useState,
  useEffect
} from "react";

import {
  Routes,
  Route,
  useParams,
  useNavigate,
  Navigate
} from "react-router-dom";

import stores from "@/stores";

// Pages
import ProjectPlay from "./play";
import ProjectEdit from "./edit";

type ProjectOverviewProps = {
  updateMenuComponents: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
};

export default function ProjectOverview ({ updateMenuComponents }: ProjectOverviewProps) {
  const [projectData, setProjectData] = useState<ProjectStructure | null>(null);
  const navigate = useNavigate();
  const params = useParams();

  // Update project to use when slug change.
  const projectSlug = params.slug;
  useEffect(() => {
    /** Debug */ console.info("[useEffect: 'projectSlug']", projectSlug);

    (async () => {
      if (!projectSlug) return;

      // Check project. If success, data is Project, else it's an error message.
      const [success, data] = await stores.projects.getProjectFromSlug(projectSlug);
      if (success) {
        setProjectData(data as ProjectStructure);
        
        // if (typeof updateMenuComponents === "function") {
        //   const switchModePath = currentMode === "edit" ? "play" : "edit";
        //   updateMenuComponents([
        //     <Link to={`${params.slug}/${switchModePath}`}>Overview Mode</Link>
        //   ]);
        // }
      }
      else {
        console.error("[useEffect: 'projectSlug'] Can't find project. See attached message.", data);

        updateMenuComponents([]);
        navigate("/projects");
      }
    })();
  }, [projectSlug]);

  // Show a loader while loading
  // and checking the project. 
  if (!projectData) return <p>Loading...</p>; 

  // Show the complete UI with routes.
  return (
    <div className="p-4">
      <h1 className="font-medium text-lg">{projectData.name}</h1>

      <Routes>
        <Route path="play" element={<ProjectPlay data={projectData} />} />
        <Route path="edit" element={<ProjectEdit data={projectData} />} />
        
        <Route path="*" element={<Navigate to="play" />} />
      </Routes>
    </div>
  );
}