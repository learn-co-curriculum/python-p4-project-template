import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './Home';
import MensShoes from './MensShoes';
import WomensShoes from './WomensShoes';
import KidsShoes from './KidsShoes';


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/mens-shoes" component={MensShoes} />
          <Route path="/womens-shoes" component={WomensShoes} />
          <Route path="/kids-shoes" component={KidsShoes} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
