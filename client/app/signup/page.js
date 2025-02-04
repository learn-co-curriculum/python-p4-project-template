'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const signupSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export default function SignupPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(
        'http://localhost:5000/auth/signup', // ✅ Corrected endpoint
        {
          name: data.name, // ✅ Include name
          email: data.email,
          password: data.password,
        },
        {
          headers: { 'Content-Type': 'application/json' }, // ✅ Ensure JSON format
        }
      );
      alert('User created successfully!');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="p-6 border rounded-lg shadow-md bg-white" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Signup</h1>

        {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Name</label>
          <input
            className="w-full p-2 border rounded text-gray-800"
            type="text"
            {...register('name')}
          />
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}
        </div>

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

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Confirm Password</label>
          <input
            className="w-full p-2 border rounded text-gray-800"
            type="password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <button
          className="w-full p-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
          type="submit"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
