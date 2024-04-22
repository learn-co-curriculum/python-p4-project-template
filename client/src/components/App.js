import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import TimeLogList from './TimeLogList';
import TimeLogForm from './TimeLogForm';
import Logout from './Logout';
import UserProfile from './UserProfile';

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/timelogs" component={TimeLogList} />
        <Route path="/timelog/new" component={TimeLogForm} />
        <Route path="/timelog/edit/:id" component={TimeLogForm} />
        <Route path="/logout" component={Logout} />
        <Route path="/profile" component={UserProfile} />
      </Switch>
    </Router>
  );
}

export default App;
