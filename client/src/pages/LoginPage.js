// src/pages/LoginPage.js
import React from 'react';
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
  const history = useHistory();

  const handleLogin = (role) => {
    if (role === 'staff') {
      history.push('/main');
    } else if (role === 'admin') {
      history.push('/menu');
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={() => handleLogin('staff')}>Staff Login</button>
      <button onClick={() => handleLogin('admin')}>Admin Login</button>
    </div>
  );
};

export default LoginPage;

