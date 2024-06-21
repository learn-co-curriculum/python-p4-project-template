import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PropertyList from '../components/PropertyList';
import Property from '../components/Property';
import AddProperty from '../components/AddProperty';
import Register from '../components/Register';
import Login from '../components/Login';
import PropertyDetail from './PropertyDetail';
import Home from './Home';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/properties" exact component={PropertyList} />
        <Route path="/properties/:id" component={Property} />
        <Route path="/add-property" component={AddProperty} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/property/:id" component={PropertyDetail} />
      </Switch>
    </Router>
  );
};

export default App;