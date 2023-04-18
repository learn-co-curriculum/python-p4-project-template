import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Farmers from './Farmers'
import Home from "./Home"
import Customer from "./Customer"
import FarmerLogin from './FarmerLogin';

// Components for each route
// const Home = () => <h1>Home Page</h1>;

function App() {

  return (
    <Router> 
      <Switch>
        <Route path="/farmers/login">
          <FarmerLogin />
        </Route>
        <Route path="/farmers">
          <Farmers />
        </Route>
        <Route path="/customers">
          <Customer />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
