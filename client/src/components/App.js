// src/components/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './NavBar'; // Ensure the correct import path

import MenuTable from '../pages/MenuTable';
import OrderList from '../pages/OrderList';
import LoginPage from '../pages/LoginPage';
import MainPage from '../pages/MainPage';
import OrdersPage from '../pages/OrdersPage';
import MenuList from '../pages/MenuList'; // Import the MenuList component

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route path="/main">
            <MainPageWithNavbar />
          </Route>
          <Route path="/orders">
            <OrdersPageWithoutNavbar />
          </Route>
          <Route path="/menu">
            <div>
              <Navbar />
              <MenuTable />
            </div>
          </Route>
          <Route path="/order-list">
            <div>
              <Navbar />
              <OrderList />
            </div>
          </Route>
          <Route path="/menu-list">
            <div>
              <Navbar />
              <MenuList />
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

// Define MainPageWithNavbar component with Navbar
const MainPageWithNavbar = () => (
  <div>
    <MainPage />
  </div>
);

// Define OrdersPageWithoutNavbar component without Navbar
const OrdersPageWithoutNavbar = () => (
  <OrdersPage />
);

export default App;


