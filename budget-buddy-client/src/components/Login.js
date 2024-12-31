import React, { useState } from 'react';
import { login } from '../api'; // Import the API function
import { useNavigate } from 'react-router-dom'; // For navigation

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await login(username, password);
            console.log('API Response:', response); // Debugging
            if (response.message === 'Login successful!') {
                setMessage('Login successful!');
                localStorage.setItem('username', username); // Save username in localStorage
                console.log('Navigating to dashboard...'); // Debugging
                navigate('/dashboard'); // Redirect to the Dashboard page
            } else {
                setMessage(response.message || 'Login failed!');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
            console.error('Login error:', error);
        }
    };    

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;