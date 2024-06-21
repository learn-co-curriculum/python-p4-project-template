import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5555/login', { email, password });
      if (response.status === 200) {
        setMessage('Login successful');
        localStorage.setItem('token', response.data.access_token);
        setTimeout(() => {
          navigate('/player');
        }, 2000); // Redirect to player page after 2 seconds
      } else {
        setMessage('Login failed');
      }
    } catch (error) {
      setMessage(`Login failed: ${error.response?.data?.msg || error.message}`);
    }
  };

  return (
    <div className='loginPage'>
      <div className='initLoginContainer'>
        <h2>☄️ Login ☄️</h2>
        <form className='loginForm' onSubmit={handleLogin}>
          <input type="email" onChange={(e) => setEmail(e.target.value)} className="form-control-login" placeholder="Email" required />
          <input type="password" onChange={(e) => setPassword(e.target.value)} className="form-control-login" placeholder="Password" required />
          <button type="submit" className="btn btn-primary mt-2">Login</button>
          <p>{message}</p>
        </form>
      </div>
    </div>
  );
}

export default Login;