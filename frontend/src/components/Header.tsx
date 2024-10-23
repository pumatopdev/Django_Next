"use client"; // Ensure this is marked as a client component

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="text-lg font-bold">MyApp Logo</div>
      
      <div>
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <img src="/path-to-user-profile-image.jpg" alt="User" className="w-8 h-8 rounded-full" />
            <span>User Name</span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="bg-blue-500 px-3 py-1 rounded">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}