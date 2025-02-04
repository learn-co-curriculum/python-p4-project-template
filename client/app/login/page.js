'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/auth/login', // ✅ Corrected endpoint
        data,
        {
          headers: { 'Content-Type': 'application/json' }, // ✅ Ensuring JSON format
        }
      );

      const token = response.data.token;
      localStorage.setItem('token', token); // ✅ Store token for authentication
      alert('Login successful!');

      // Optionally, redirect the user to the home/dashboard page
      window.location.href = '/dashboard'; 
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="p-6 border rounded-lg shadow-md bg-white" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Login</h1>

        {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Email</label>
          <input
            className="w-full p-2 border rounded text-gray-800"
            type="email"
            {...register('email')}
          />
          {errors.email && <p className="text-red-600">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Password</label>
          <input
            className="w-full p-2 border rounded text-gray-800"
            type="password"
            {...register('password')}
          />
          {errors.password && <p className="text-red-600">{errors.password.message}</p>}
        </div>

        <button
          className="w-full p-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}
