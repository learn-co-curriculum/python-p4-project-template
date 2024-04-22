import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './AuthContext';


const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error messages before the new login attempt
    try {
      const success = await login(formData);
      if (success) {
        history.push('/timelogs'); // Redirect to TimeLogList upon successful login
      }
    } catch (error) {
      console.error('Login failed:', error.message);
      setError(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="field-container">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field-container">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
      {/* <div className="login-image-container">
        <img
          src="https://res.cloudinary.com/doyp4tk82/image/upload/v1711946154/Blue_Green_Abstract_Testimonial_Review_Facebook_Post_1_zxmjxl.png"
          alt="Login Visual"
        />
      </div> */}
    </div>
  );
};

export default Login;
