import {
  BrowserRouter,
  Redirect,
  Switch,
  Route
} from "react-router-dom";

// Route /
import Home from "../pages/Home";

// Routes /projects/*
import ProjectsHome from "../pages/projects/Home";
import ProjectInformations from "../pages/projects/project/Informations";
import ProjectEdit from "../pages/projects/project/Edit";
import ProjectPlay from "../pages/projects/project/Play";

// Routes /utilities/*
import UtilitiesHome from "../pages/utilities/Home";
import UtilitiesAbletonParse from "../pages/utilities/AbletonParse";

export default function Router () {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />

        <Route exact path="/projects" component={ProjectsHome} />
        <Route path="/projects/:projectSlugName/informations" component={ProjectInformations} />
        <Route path="/projects/:projectSlugName/play" component={ProjectPlay} />
        <Route path="/projects/:projectSlugName/edit" component={ProjectEdit} />
        <Redirect from="/projects/:projectSlugName" to="/projects/:projectSlugName/informations"/>

        <Route exact path="/utilities" component={UtilitiesHome} />
        <Route path="/utilities/ableton-parse" component={UtilitiesAbletonParse} />

        {/* 404 */}
        <Route render={() => <h1>404</h1>} />
      </Switch>
    </BrowserRouter>
  );
}
