"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';  // New way to use router in App Router
import { register as registerService } from '../../services/authService';
import { validateEmail } from '../../utils/validation';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const {role} = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email format
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await registerService(firstName, lastName, email, password);
      if(response.success){
        alert('Registration successful!');
        router.push('/login');  // Redirect to login after successful registration
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleBackToHome = () => {
    if (role === 'admin') {
      router.push('/user-management');
    } 
    else{
      router.push('/login');
    }  // Navigate to the home page
  };

  return (
    <Layout>
      <div className="flex items-center justify-center text-black">
        <form className="w-full max-w-md bg-white p-8 rounded-lg" onSubmit={handleSubmit}>
          <h1 className="text-2xl mb-4">Register</h1>
          {error && <p className="text-red-500">{error}</p>}
          
          <div className="mb-4">
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
            Register
          </button>
          <button
            type="button"  // It's a button, but we specify it shouldn't submit the form
            onClick={handleBackToHome}  // Navigate to home when clicked
            className="mt-4 w-full bg-gray-500 text-white p-2 rounded"
          >
            ← Back
          </button>
        </form>
      </div>
    </Layout>
  );
}