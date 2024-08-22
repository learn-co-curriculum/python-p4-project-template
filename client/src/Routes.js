import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Transactions from './components/Transaction/Transactions';
// import CreditPage from './pages/CreditPage';
// import DebitPage from './pages/DebitPage';
import TransactionHistory from './pages/TransactionHistory';
import StatsPage from './pages/StatsPage';
import FriendshipPage from './pages/FriendshipPage';

function Routes({ currentUser }) {
  if (!currentUser) return <Redirect to="/" />;

  return (
    <Switch>
      <Route exact path="/">
        <Transactions currentUser={currentUser} />
      </Route>
      {/* <Route path="/credit">
        <CreditPage currentUser={currentUser} />
      </Route>
      <Route path="/debit">
        <DebitPage currentUser={currentUser} />
      </Route> */}
      <Route path="/transactions">
        <TransactionHistory currentUser={currentUser} />
      </Route>
      <Route path="/stats">
        <StatsPage currentUser={currentUser} />
      </Route>
      <Route path="/friendship">
        <FriendshipPage currentUser={currentUser} />
      </Route>
    </Switch>
  );
}

export default Routes;