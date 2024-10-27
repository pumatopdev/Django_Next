"use client"; // Ensure this is marked as a client component

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import {useState } from 'react'
import UpdateProfileWidget from './UpdateProfile';
import { updateProfile } from '@/services/userService';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export default function Header() {
  const { first_name, last_name, email, role,is_active, id, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }

  const handleProfileClick = () => {
    setProfileOpen(true);
    setDropdownOpen(false);
  }

  const closeProfileOverlay = () => {
    setProfileOpen(false);
  }

  const handleLogout = () => {
    logout();
  };

  const handleUpdateProfile = async (updatedUser:User) => {
    setLoading(true);
    try{
      const response = await updateProfile(updatedUser);
      if(response.success){
        setProfileOpen(false);
      }
    }
    catch(error){
      setError("Error updating user");
    }finally{
      setLoading(false);
    }
  }



  return (
    <header className="p-4 bg-blue-950">
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
              <span className='font-black text-black'>{email}</span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                {role === 'admin' ? (
                  <>
                    {/* If user is admin */}
                    <Link href="/admin/management" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                      Django Template Admin
                    </Link>
                    <Link href="/user-management" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                      Custome User Management
                    </Link>
                  </>
                ) : (
                  <>
                    {/* If user is a regular user */}
                    <button onClick = {handleProfileClick} className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                      My Profile
                    </button>
                  </>
                )}

                {/* Common logout button for both roles */}
                <button
                  onClick={handleLogout}
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
      {
        profileOpen && first_name && last_name && email && role && (
          <UpdateProfileWidget
            user = {{first_name:first_name, last_name:last_name, email:email, role:role, is_active:is_active, id: id }}
            onClose={closeProfileOverlay}
            onSave={handleUpdateProfile}
            />
        )
      }
    </header>
  );
}