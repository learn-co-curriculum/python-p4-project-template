import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './NavBar';
import UserPanel from './UserPanel/UserPanel';
import CreditPage from '../pages/CreditPage';
import DebitPage from '../pages/DebitPage';
import StatsPage from '../pages/StatsPage';
import FriendshipPage from '../pages/FriendshipPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch('/check_session')
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => setCurrentUser(data));
        }
      });
  }, []);

  return (
    <Router>
      <div className="App">
        <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <h1>FlatPay</h1>
        <Switch>
          <Route exact path="/">
            <UserPanel currentUser={currentUser} setCurrentUser={setCurrentUser} />
          </Route>
          {currentUser && (
            <>
              <Route path="/credit">
                <CreditPage currentUser={currentUser} />
              </Route>
              <Route path="/debit">
                <DebitPage currentUser={currentUser} />
              </Route>
              <Route path="/stats">
                <StatsPage currentUser={currentUser} />
              </Route>
              <Route path="/friendship">
                <FriendshipPage currentUser={currentUser} />
              </Route>
            </>
          )}
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;