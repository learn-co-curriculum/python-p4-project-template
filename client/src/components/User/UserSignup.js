import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import './Form.css'; 

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = "Email is required";
        }
        if (!password) {
            newErrors.password = "Password is required";
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const signUp = (e) => {
        e.preventDefault();
        if (validateForm()) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((auth) => {
                    console.log(auth);
                    alert('Successfully created account');
                    navigate('/login');
                })
                .catch((error) => {
                    console.log(error);
                    alert("Error creating account");
                });
        }
    };

    return (
        <div className='form-container'>
            <form onSubmit={signUp}>
                <h1>Create An Account</h1>
                <input 
                    type='text' 
                    placeholder='Email' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="error">{errors.email}</p>}
                <input 
                    type='password' 
                    placeholder='Password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="error">{errors.password}</p>}
                <input 
                    type='password' 
                    placeholder='Confirm Password' 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                <button type='submit'>Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
