import React, { useState } from 'react';
import '../styles/Login.css';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


//CREATE FETCH TO LOGIN


  return (
    <form className='login-form-container'>
      <h1 className='login-form-title'>Login</h1>
      <label className='login-form-label'>
        Username:
        <input className='login-form-input' type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <br />
      <label className='login-form-label'>
        Password:
        <input className='login-form-input' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button className='login-form-button' type="submit">Login</button>
    </form>
  );
};

export default Login;
