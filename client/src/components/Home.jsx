import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import "./Home.css"

function Home() {
  const [showSignup, setShowSignup] = useState(true);

  const handleToggleForm = () => {
    setShowSignup(!showSignup); // Toggle between signup and login
  };

  return (
    <div className="welcome" style={{ padding: '20px' }}>
      <h1>Welcome to Space Explorer</h1>
      <p>Explore the universe with our advanced spacecrafts and missions.</p>
      <button onClick={handleToggleForm} className="toggle-btn">
        {showSignup ? 'Switch to Login' : 'Switch to Signup'}
      </button>
      {showSignup ? <Signup /> : <Login />}
    </div>
  );
}

export default Home;