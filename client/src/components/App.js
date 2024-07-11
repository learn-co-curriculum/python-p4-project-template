import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Logout from './Logout';
import Events from './Events';
import CreateEvent from './CreateEvent';
import Homepage from '../../../frontend/src/Homepage';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/logout" component={Logout} />
          <Route path="/events" component={Events} />
          <Route path="/create-event" component={CreateEvent} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
