import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Farmers from './Farmers'

// Components for each route
const Home = () => <h1>Home Page</h1>;
// const Farmers = () => <h1>About Page</h1>;
const Route3 = () => <h1>Route 3 Page</h1>;
const Route4 = () => <h1>Route 4 Page</h1>;

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/farmers">Farmers</Link>
          </li>
          <li>
            <Link to="/Route3">Route 3</Link>
          </li>
          <li>
            <Link to="/Route4">Route 4</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/farmers">
          <Farmers />
        </Route>
        <Route path="/Route3">
          <Route3 />
        </Route>
        <Route path="/Route4">
          <Route4 />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
