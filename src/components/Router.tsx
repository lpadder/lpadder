import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";


export default function Router () {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <h1>Hello World !</h1>} />

        {/* 404 */}
        <Route render={() => <h1>404</h1>} />
      </Switch>
    </BrowserRouter>
  );
}