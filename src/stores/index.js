import ProjectsStore from "./projects";
const databaseName = "lpadder";

export default {
  projects: new ProjectsStore(databaseName)
}