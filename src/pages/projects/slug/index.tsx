import {
  useEffect
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import {
  useCurrentProjectStore,
  useLocalProjectsStore
} from "@/stores/projects";

import ProjectPlay from "@/components/ProjectPlay";
import ProjectEditor from "@/components/ProjectEditor";

export default function ProjectOverview () {
  const navigate = useNavigate();
  const params = useParams();

  const localProjects = useLocalProjectsStore(state => state.localProjects);

  const {
    project,
    setProject,
    setIsSaved
  } = useCurrentProjectStore(state => ({
    project: state.currentProject,
    setProject: state.setCurrentProject,
    setIsSaved: state.setIsSaved
  }));

  // Update project to use when slug change.
  const projectSlug = params.slug;
  useEffect(() => {
    if (!projectSlug || !localProjects) return;

    console.group(`[/${projectSlug}][useEffect]`);
    console.info("⌛ Loading", projectSlug, "project from 'localProjects' state.");

    // Get the project data and save it to local state.
    const projectStructureData = localProjects.find(e => e.slug === projectSlug);
    if (projectStructureData) {
      setProject(projectStructureData);
      // On the first load, the project is already saved
      // but when calling `setProject`, it will
      // automatically set `isSaved` to false.
      setIsSaved(true);

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

  // Show a loader while loading and checking the project. 
  if (!project)
    return <p>Loading...</p>;

  // Load all the components to run the project.
  return (
    <div className="p-4">
      <ProjectPlay />
      <ProjectEditor />
    </div>
  );
}
