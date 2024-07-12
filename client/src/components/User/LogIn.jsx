import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './Auth.css';

function Login() {
    const { user, login } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);  // For displaying error messages

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Invalid username or password');  // Custom error message
            })
            .then(data => {
                login(data);
            })
            .catch(error => {
                setError(error.message);  // Set error state for displaying error message
            });
    };

    if (user) {
        return <Redirect to="/" />;
    }

    return (
        <div className="form-container">
            <h2 className="form-header">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="form-button">Login</button>
                {error && <p className="error-message">{error}</p>}  {/* Display error message if any */}
            </form>
            <a href="/signup" className="form-link">Don't have an account? Sign up</a>
        </div>
    );
}

export default Login;
