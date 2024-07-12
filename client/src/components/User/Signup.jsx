import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import './Auth.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [signedUp, setSignedUp] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors ? errorData.errors.join(', ') : 'Sign Up failed');
            }

            const data = await response.json();
            // Handle successful signup logic if needed (e.g., set user context)
            setSignedUp(true);
        } catch (error) {
            console.error('Sign Up failed:', error.message);
            setError(error.message);
        }
    };

    if (signedUp) {
        return <Redirect to="/login" />;
    }

    return (
        <div className="form-container">
            <h2 className="form-header">Sign Up</h2>
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
                <button type="submit" className="form-button">Sign Up</button>
                {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
            </form>
            <a href="/login" className="form-link">Already have an account? Log in</a>
        </div>
    );
};

export default SignUp;
