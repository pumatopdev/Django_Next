"use client"

import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../services/userService';  // Correct import path
import Layout from '../../components/Layout';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({ user_id: '',first_name: '', last_name: '', email: ''});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const {logout, role, email, isAuthenticated} = useAuth();

  const fetchProfile = async () => {
    try{
      const response = await getProfile();
      if (response.success) {
        setProfile(response.data);  // Set the profile data
        localStorage.setItem('user_id', profile.user_id);
        setLoading(false);
      } else {
        setError('Error fetching profile');  // Handle the error
        setLoading(false);
      }
    }catch(error){
      setError('Error fetching profile');
      setLoading(false);
    }

    
  };

  useEffect(() => {
    // Fetch the profile when the component loads
    if (role ==='user') {
      fetchProfile();
    }
  }, [isAuthenticated]);
  
  const handleUpdateProfile = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const response = await updateProfile(profile);
    if (response.success) {
      setSuccess('Profile updated successfully!');
      logout();
      router.push('login/');
    } else {
      setError("Update Profile Error!");
    }
  };

  return (
    <Layout>
    <div className="profile-container">
      <h2>My Profile</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {/* Display a loader or wait for data */}
      {
        loading?(
          <p>Loading profile...</p>
        ):(
          <form onSubmit={handleUpdateProfile}>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                value={profile.first_name}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                value={profile.last_name}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </div>
            <button type="submit">Update Profile</button>
          </form>
        )
      }
      
    </div>
    </Layout>
  );
};

export default ProfilePage;