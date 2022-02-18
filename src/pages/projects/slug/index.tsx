import type {
  ProjectStructure,
  ProjectStoredStructure
} from "@/types/Project";

import React, {
  useState,
  useEffect
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import stores from "@/stores";
import { useProjectsStore } from "@/pages/projects";

// Pages
import ProjectPlay from "@/components/ProjectPlay";


type ProjectOverviewProps = {
  updateMenuComponents: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
};

export default function ProjectOverview ({
  updateMenuComponents
}: ProjectOverviewProps) {
  const navigate = useNavigate();
  const params = useParams();

  const { allLocalProjects, setAllLocalProjects } = useProjectsStore(state => ({
    allLocalProjects: state.allLocalProjects as ProjectStoredStructure[],
    setAllLocalProjects: state.setAllLocalProjects
  }));

  // Project data state that will be shared
  // with 'settings' and 'play'.
  // We use this state, when saving, to update
  // global project state.
  const [projectLocalData, setProjectLocalData] = useState<ProjectStructure | null>(null);

  useEffect(() => console.info(":slug Reloaded"), []);

  // Update project to use when slug change.
  const projectSlug = params.slug;
  useEffect(() => {
    console.group("[/:slug][useEffect]");
    console.info("⌛ Loading", projectSlug, "project from 'allLocalProjects' state.");

    // Check if 'projectSlug' exists on router.
    if (!projectSlug) return;

    // Get the project data and save it to local state.
    const projectStructureData = allLocalProjects.find(e => e.slug === projectSlug);
    if (projectStructureData) {
      setProjectLocalData(projectStructureData.data);
      setChangesNotSaved(false);

      console.info("✔️ Finished load of", projectSlug, "project.");
      console.groupEnd();
    }
    // Project wasn't found (can happen when URL slug doesn't exist).
    else {
      console.error("Project", projectSlug, "not found ! Redirecting to '/projects'.");
      console.groupEnd();
      
      navigate("/projects");
    }
  }, [projectSlug]);

  const SaveButtonInMenu = ({ changesNotSaved }: { changesNotSaved: boolean }) => {
    return (
      <button
        className={`py-2 px-4 ${changesNotSaved ? "bg-pink-600" : "bg-blue-600"} bg-opacity-60 rounded-full`}
        onClick={() => saveProjectGlobally(projectLocalData as ProjectStructure)}
      >
        {changesNotSaved ? "Save" : "Saved"}
      </button>
    );
  };

  // Set to 'true' when a local save has been made.
  const [changesNotSaved, setChangesNotSaved] = useState(false);
  useEffect(() => {
    console.info("[changesNotSaved] New state:", changesNotSaved);

    updateMenuComponents([<SaveButtonInMenu key={null} changesNotSaved={changesNotSaved} />]);
  }, [changesNotSaved]);

  /** Update the local state of the current project. */
  const saveProjectLocally = (data: ProjectStructure) => {
    if (!projectSlug) return;

    // Update local state data.
    setProjectLocalData(data);
    setChangesNotSaved(true);
  };

  /** Update the local state AND the global state. */
  const saveProjectGlobally = async (data: ProjectStructure) => {
    if (!projectSlug) return;

    // Also update the localForage.
    const [success, slug, project] = await stores.projects.updateProject(projectSlug, data);
    if (!success || !project) return;

    const updatedAllLocalProjects =  [ ...allLocalProjects ];
    const projectToUpdateIndex = updatedAllLocalProjects.findIndex(
      e => e.slug === slug
    );

    updatedAllLocalProjects[projectToUpdateIndex] = {
      slug: slug,
      data: project
    };

    setAllLocalProjects([ ...updatedAllLocalProjects ]);
    setChangesNotSaved(false);
  };

  // Show a loader while loading
  // and checking the project. 
  if (!projectLocalData) return <p>Loading...</p>; 

  // Load all the components to run the project.
  return (
    <div className="p-4">
      <ProjectPlay
        data={projectLocalData}
        saveProjectLocally={saveProjectLocally}
        saveProjectGlobally={saveProjectGlobally}
      />
    </div>
  );
}