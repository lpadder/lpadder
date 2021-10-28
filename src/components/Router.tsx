import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";

// Route /
import Home from "../pages/Home";

// Routes /utilities/*
import UtilitiesHome from "../pages/utilities/Home";
import UtilitiesAbletonParse from "../pages/utilities/AbletonParse";

export default function Router () {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />

        <Route exact path="/utilities" component={UtilitiesHome} />
        <Route path="/utilities/ableton-parse" component={UtilitiesAbletonParse} />

        {/* 404 */}
        <Route render={() => <h1>404</h1>} />
      </Switch>
    </BrowserRouter>
  );
}