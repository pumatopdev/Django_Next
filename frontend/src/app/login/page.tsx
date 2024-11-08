"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { login} from '../../services/authService';
import { validateEmail } from '../../utils/validation';
import Layout from '../../components/Layout';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsAuthenticated, setAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    try {
      const response = await login(email, password);
      if(response?.success){
        setLoading(false);
        setAuth(response.data.first_name, response.data.last_name, response.data.email, response.data.role,response.data.is_active, response.data.user_id); 
        setIsAuthenticated(true);
        

        if(response.data === 'superuser'){
          router.push('/admin/');
        } else if (response.data === 'admin'){
          router.push('/');
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      setError('Invalid login credentials');  //toast.error!
    } finally{
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex text-black">
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
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled = {loading}>
            {loading? 'Logging in...' : 'Login'}
          </button>
          {/* Register link using <Link> */}
          <div className='mt-4'>
            <p className='text-sm text-gray-600'>
              Don't have an account?{' '}
              <a href = "/register" className='text-blue-500 float-right'>
              Register here</a>
              <a href = "/" className='text-blue-500 float-left'>
              Back</a>
            </p>
          </div>

        </form>
      </div>
    </Layout>
  );
}