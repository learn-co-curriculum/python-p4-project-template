'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login'); // Redirect to login if not authenticated
          return;
        }

        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.user);
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-800">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!user) {
    // Return a fallback UI if user is not available
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-800">No user data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 p-4 text-white text-center">
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
          <div className="mb-4">
            <p className="text-gray-600">
              <span className="font-semibold">Name:</span> {user.name}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">
              <span className="font-semibold">Role:</span> {user.role}
            </p>
          </div>
          <button
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            onClick={() => {
              localStorage.removeItem('access_token');
              router.push('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
