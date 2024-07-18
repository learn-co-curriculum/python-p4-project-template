import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/AuthForms/Login';
import Register from './components/AuthForms/Register';
import UserDetails from './components/User/UserDetails';
import UserList from './components/User/UserList';
import UserReview from './components/User/UserReview';
import UserSignup from './components/User/UserSignup';
import Header from './components/Header';
import ReviewForm from './components/ReviewForm';
import TravelGuideDetail from './components/TravelGuideDetail';
import TravelGuideList from './components/TravelGuideList';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={TravelGuideList} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/user/:id" component={UserDetails} />
          <Route path="/users" component={UserList} />
          <Route path="/review/:travelGuideId" component={UserReview} />
          <Route path="/user-signup" component={UserSignup} />
          <Route path="/review-form" component={ReviewForm} />
          <Route path="/travel-guide/:id" component={TravelGuideDetail} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
