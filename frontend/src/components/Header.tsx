"use client"; // Ensure this is marked as a client component

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useState } from 'react'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }

  return (
    <header className="p-4 bg-gray-200">
      <div className="flex justify-between items-center">

        {/* Logo or App Name */}
        <h1 className="text-xl font-bold">My App</h1>

        {/* Conditional rendering based on whether the user is authenticated */}
        {isAuthenticated ? (
          <div className="relative">
            {/* User's profile image and username */}
            <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
              {/* Placeholder for user profile image */}
              <img
                src="/path-to-placeholder-image.jpg"  // You can replace this with the real image source
                alt="User Image"
                className="w-8 h-8 rounded-full"
              />
              <span>{user?.username}</span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                {user?.role === 'admin' ? (
                  <>
                    {/* If user is admin */}
                    <Link href="/user-management">
                      <a className="block px-4 py-2 text-gray-700 hover:bg-gray-200">User Management</a>
                    </Link>
                  </>
                ) : (
                  <>
                    {/* If user is a regular user */}
                    <Link href="/profile">
                      <a className="block px-4 py-2 text-gray-700 hover:bg-gray-200">My Profile</a>
                    </Link>
                  </>
                )}

                {/* Common logout button for both roles */}
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Show login button if the user is not authenticated
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}