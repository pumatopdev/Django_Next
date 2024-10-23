"use client";  // Mark this as client-side since it uses React hooks

import { useState, useEffect } from 'react';
import { getUsers, deleteUser, createUser, updateUser } from '../../services/userService';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Layout from '@/components/Layout';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function UserManagement() {
  const {user, isAuthenticated} = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ id: '',username: '', email: '', role: 'user' });
  const [editUser, setEditUser] = useState({id: '', username: '', email: '', role: 'user'});
  const [error, setError] = useState('');

  const fetchUsers = async() => {
    try {
      const response = await getUsers();
      if (response.success) {
        setUsers(response.data);
    }
    } catch (error) {
      setError('Get all user data is error');
    }
    
  }

  useEffect(() => {
    // Fetch the list of users
    if(!isAuthenticated){
      router.push('/');
    }
    if(user?.role === 'admin'){
      fetchUsers();
    }
    else if(user?.role === 'user'){
      setEditUser({id: user.id, username: user.username, email: user.email, role: user.role})
    }
  }, [user, getUsers, isAuthenticated]);


  const handleCreateUser = async(e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const response = await createUser(newUser)
      if(response.success) {
        setUsers([...users,response.data]);
        setNewUser({id: '', username:'', email:'', role:'user'});
      }
    } catch (error) {
      setError("Create User Error");
    }
  };

  const handleDeleteUser = async(userId: string) => {
    try {
      const response = await deleteUser(userId);
      if(response.success){
        setUsers(users.filter(user=>user.id !== userId));
    }
    } catch (error) {
      setError('Delete User Error')
    }
  };


  const handleUpdateUser = async (userId: string, updateData:User) => {
    try {
      const response = await updateUser(userId, updateData);
      if(response.success){
        setUsers(users.map(u => (u.id === userId ? response.data: u)));
        setEditUser({ id: '', username: '', email: '', role: 'user' });
      }
    } catch (error) {
      setError('Update your informaion Error');
    }
  }

  const handleUpdateOwnProfile = async(e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      if(user?.id){
        handleUpdateUser(user?.id || '', editUser)
      };
    } catch (error) {
      setError("Update Userprofile Error");
    }
  };


  return (
    <Layout>
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-2xl mb-4">{user?.role === 'admin' ? 'Admin User Management' : 'Your Profile'}</h1>

      {error && <p className="text-red-500">{error}</p>}

      {user?.role === 'admin' ? (
        // Admin View: Show all users and allow editing/deleting any user
        <ul>
          {users.map((u) => (
            <li key={u.id} className="p-4 border border-gray-300 mb-2">
              <p>{u.username} ({u.role})</p>
              <p>{u.email}</p>

              {/* Admin can update any user's profile */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateUser(u.id, {
                    username: u.username,
                    role: u.role,
                    id: '',
                    email: ''
                  });
                }}
              >
                <input
                  type="text"
                  defaultValue={u.username}
                  onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                  className="p-2 border border-gray-300 rounded mb-2"
                />
                <select
                  defaultValue={u.role}
                  onChange={(e) => handleUpdateUser(u.id, {
                    role: e.target.value,
                    id: '',
                    username: '',
                    email: ''
                  })}
                  className="p-2 border border-gray-300 rounded mb-2"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                  Update
                </button>
              </form>

              <button onClick={() => deleteUser(u.id)} className="bg-red-500 text-white p-2 rounded">
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        // General User View: Can only edit their own profile
        <form onSubmit={handleUpdateOwnProfile} className="mb-6">
          <input
            type="text"
            value={editUser.username}
            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
            className="p-2 border border-gray-300 rounded mb-2"
            required
          />
          <input
            type="email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            className="p-2 border border-gray-300 rounded mb-2"
            required
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Update Profile
          </button>
        </form>
      )}
    </div>
    </Layout>
  );
}