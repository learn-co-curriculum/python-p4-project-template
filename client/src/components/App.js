import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from "./Home"
import FarmerLogin from './FarmerLogin';
import FarmerOrders from './FarmerOrders';
import Signin from './Signin';
import CustomerLogin from './CustomerLogin';
import CustomerPage from './CustomerPage';

// Components for each route
// const Home = () => <h1>Home Page</h1>;

function App() {

  return (
    <Router> 
      <Switch>
        <Route path="/customers/orders">
          <CustomerPage />
        </Route>
        <Route path="/farmers/orders">
          <FarmerOrders />
        </Route>
        <Route path="/farmers/login">
          <FarmerLogin />
        </Route>
        <Route path="/customers">
          <CustomerLogin />
        </Route>
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
