// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Route, Switch ,Link} from 'react-router-dom';
import Login from './login';
import Register from './register';
import Logout from './logout';
import Events from './events';
import Homepage from './Homepage';



function App() {
  return (
    <Router>
      <div>
        <Link to ="/">Homepage</Link>
    
        <Switch>
          <Route exact path="/login/">
          <Login />
        </Route>
        <Route exact path="/logout/">
          <Logout />
        </Route>
        <Route exact path="/register/">
          <Register/>
        </Route>
        <Route exact path="/events/">
          <Events />
        </Route>
        <Route exact path="/homepage/">
          <Homepage />
        </Route>
        </Switch>
      </div>
    </Router>
  );
}
export default App;
