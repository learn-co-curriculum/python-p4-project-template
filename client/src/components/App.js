import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';
import Navbar from './Navbar';
import Routes from './Routes';
import Employees from './EmployeeCard';
import '../index.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username, password) => {
    // do actual login here
    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid username or password');
    }
  };

  function handleLogOut() {
    setIsLoggedIn(false)

}


  return (
    <Router>
      <div className="App">
        {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} handleLogOut={handleLogOut}/>}
        <Routes isLoggedIn={isLoggedIn} handleLogin={handleLogin} />
      </div>
    </Router>
  );
};

export default App;