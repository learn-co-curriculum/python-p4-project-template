import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";

const LandingPage = () => {
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const navigate = useNavigate(); // Use useNavigate

  const handleLogin = () => {
    if (username.trim() === "" || password.trim() === "") {
      alert("Please enter both username and password.");
      return;
    }
    // Perform any additional login validation if necessary
    navigate("/menu-table"); // Redirect to the MenuTable page
  };

  return (
    <div className="landing-page">
      <h1>Welcome to Online Food Menu</h1>
      <div className="login-container">
        <h2>Admin Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button className="login-button" onClick={handleLogin}>
          Log In
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
