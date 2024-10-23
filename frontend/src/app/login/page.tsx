"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { login as loginService } from '../../services/authService';
import { validateEmail } from '../../utils/validation';
import Layout from '../../components/Layout';

export default function LoginPage() {
  const router = useRouter();
  const { login: setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    try {
      const data = await loginService(email, password);
      setAuth(data.token);  // Store JWT token in context
      router.push('/');      // Redirect to Dashboard
    } catch (err) {
      setError('Invalid login credentials');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <form className="w-full max-w-md bg-white p-8 rounded-lg" onSubmit={handleSubmit}>
          <h1 className="text-2xl mb-4">Login</h1>
          {error && <p className="text-red-500">{error}</p>}
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
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
}