import localforage from "localforage";
import ProjectsStore from "./projects";

const database = localforage.createInstance({
  name: "lpadder"
});

export default {
  projects: new ProjectsStore(database)
}