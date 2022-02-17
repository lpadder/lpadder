import type {
  ProjectStructure,
  ProjectStoredStructure
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
import ProjectSettings from "./settings";

type ProjectOverviewProps = {
  allLocalProjects: ProjectStoredStructure[];
  setAllLocalProjects: React.Dispatch<
    React.SetStateAction<ProjectStoredStructure[] | null>
  >;

  updateMenuComponents: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
};

export default function ProjectOverview ({
  allLocalProjects,
  setAllLocalProjects,
  updateMenuComponents
}: ProjectOverviewProps) {
  const navigate = useNavigate();
  const params = useParams();

  // Project data state that will be shared
  // with 'settings' and 'play'.
  // We use this state, when saving, to update
  // global project state.
  const [projectLocalData, setProjectLocalData] = useState<ProjectStructure | null>(null);

  // Update project to use when slug change.
  const projectSlug = params.slug;
  useEffect(() => {
    /** Debug */ console.info(
      "[useEffect: 'projectSlug']", projectSlug
    );

    // Check if 'projectSlug' exists on router.
    if (!projectSlug) return;

    const projectStructureData = allLocalProjects.find(e => e.slug === projectSlug);
    console.log()
    if (projectStructureData) {
      setProjectLocalData(projectStructureData.data);
    }
    else {
      navigate("/projects");
    }
  }, [projectSlug]);

  /** Update the local state of the current project. */
  const saveProjectLocally = async (data: ProjectStructure) => {
    if (!projectSlug) return;

    // Update local state data.
    setProjectLocalData(data);

    // Also update the localForage.
    const [success, slug, project] = await stores.projects.updateProject(projectSlug, data);
    if (!success || !project) return;

    return { slug, project };
  }

  /** Update the local state AND the global state. */
  const saveProjectGlobally = async (data: ProjectStructure) => {
    if (!projectSlug) return;

    const savedData = await saveProjectLocally(data);
    if (savedData) {
      const updatedAllLocalProjects =  [ ...allLocalProjects ];
      const projectToUpdateIndex = updatedAllLocalProjects.findIndex(
        e => e.slug === savedData.slug
      );

      updatedAllLocalProjects[projectToUpdateIndex] = {
        slug: savedData.slug,
        data: savedData.project
      };

      setAllLocalProjects([ ...updatedAllLocalProjects ]);
    }
  }

  // Show a loader while loading
  // and checking the project. 
  if (!projectLocalData) return <p>Loading...</p>; 

  // Show the complete UI with routes.
  return (
    <div className="p-4">
      <h1 className="text-lg font-medium">{projectLocalData.name}</h1>

      <Routes>
        <Route path="play" element={
          <ProjectPlay
            data={projectLocalData}
            saveProjectLocally={saveProjectLocally}
            saveProjectGlobally={saveProjectGlobally}
          />
        } />
        <Route path="settings" element={
          <ProjectSettings
            data={projectLocalData}
            saveProjectLocally={saveProjectLocally}
            saveProjectGlobally={saveProjectGlobally}
          />}
        />
        
        <Route path="*" element={<Navigate to="play" />} />
      </Routes>
    </div>
  );
}