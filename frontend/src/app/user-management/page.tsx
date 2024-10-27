"use client";  // Mark this as client-side since it uses React hooks

import { useState, useEffect } from 'react';
import { getUsers, deleteUser, createUser, updateUser } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import Layout from '@/components/Layout';
import UserUpdateWidget from '@/components/UserUpdateWidget';
import Link  from 'next/link';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export default function UserManagement() {
  const {role, isAuthenticated, } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ id: '',first_name: '',last_name: '', email: '', password:'', confirm_password:''});
  const [editUser, setEditUser] = useState({id: '', first_name: '',last_name: '', email: '', password: ''});
  const [selectedUser, setSelectedUser] = useState<User|null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async() => {
    try {
      const response = await getUsers();
      if (response.success) {
        setUsers(response.data);
        setLoading(false);
    }
    } catch (error) {
      setError('Get all user data is error');
    }
    
  }

  useEffect(() => {
    // Fetch the list of users
    if(role === 'admin'){
      fetchUsers();
    }
  }, [isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setNewUser((prevUser)=>({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleCreateUser = async(e: React.FormEvent) => {
    e.preventDefault();
    if(newUser.password !== newUser.confirm_password){
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await createUser(newUser)
      if(response.success) {
        setUsers((prevUsers) => [...prevUsers, response.data.data]);
        console.log(response.data);
        ////////////////////////////////////////////////
        setNewUser({id: '', first_name:'', last_name:'',email:'', password:'', confirm_password:''});
      }
    } catch (error) {
      setError("Create User Error");
    }finally{
      setLoading(false);
    }
  };

  const handleDeleteUser = async(userId: string) => {
    try {
      const response = await deleteUser(userId);
      if(response.success){
        setUsers(users.filter(user=>user.id !== userId));
    }
    } catch (error) {
      setError('Delete User Error');
    }
  };

  const handleOpenUpdateWidget = (user: User) => {
    setSelectedUser(user);
  }

  const handleUpdateUser = async (updatedUser:User) => {
    setLoading(true);
    try{
      const response = await updateUser(updatedUser.id, updatedUser);
      if(response.success){
        setUsers(users.map(user=>user.id === updatedUser.id ? response.data.data:user));
        setSelectedUser(null);
      }
    }
    catch(error){
      setError("Error updating user");
    }finally{
      setLoading(false);
    }
  }


  // const handleUpdateUser = async (userId: string, updateData:User) => {
  //   try {
  //     const response = await updateUser(userId, updateData);
  //     if(response.success){
  //       setUsers(users.map(u => (u.id === userId ? response.data: u)));
  //       setEditUser({ id: '', username: '', email: '', role: 'user' });
  //     }
  //   } catch (error) {
  //     setError('Update your informaion Error');
  //   }
  // }
 console.log(users);
  return (
    <Layout>
    <div className="max-w-screen-xl mx-auto py-12">
      <h1 className="text-2xl mb-4"> Admin User Management</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg divide-y divide-gray-200 dark:border-gray-700 dark:divide-gray-700">
              <div className="flex py-3 px-4">
                <div className="relative max-w-xs">
                  <label className="sr-only">Search</label>
                  <input type="text" name="hs-table-with-pagination-search" id="hs-table-with-pagination-search" className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="Search for items" />
                </div>
              </div>
              <form onSubmit={handleCreateUser} className=" flex bg-gray-500 p-5 space-x-2">
                <input aria-label="First Name" type="text" name="first_name"  className="max-w-40 px-5 py-3 text-base leading-6 text-gray-900 placeholder-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md appearance-none focus:outline-none focus:placeholder-gray-400" placeholder="First Name"  value={newUser.first_name} onChange={handleInputChange} required />
                <input aria-label="Last Name" type="text" name="last_name"  className="max-w-40 px-5 py-3 text-base leading-6 text-gray-900 placeholder-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md appearance-none focus:outline-none focus:placeholder-gray-400" placeholder="Last Name" value={newUser.last_name} onChange={handleInputChange} required />
                <input aria-label="Email address" type="email" name="email"  className="max-w-40 px-5 py-3 text-base leading-6 text-gray-900 placeholder-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md appearance-none focus:outline-none focus:placeholder-gray-400" placeholder="emails" value={newUser.email} onChange={handleInputChange} required />
                <input aria-label="Password" type="password" name="password"  className="max-w-40 px-5 py-3 text-base leading-6 text-gray-900 placeholder-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md appearance-none focus:outline-none focus:placeholder-gray-400" placeholder="Password" value={newUser.password} onChange={handleInputChange} required />
                <input aria-label="Confirm Password" type="password" name="confirm_password"  className="max-w-40 px-5 py-3 text-base leading-6 text-gray-900 placeholder-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md appearance-none focus:outline-none focus:placeholder-gray-400" placeholder="Confirm" value={newUser.confirm_password} onChange={handleInputChange} required />
                <button type='submit' className="items-center justify-center px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-indigo-500 border border-transparent rounded-md hover:bg-indigo-400 focus:outline-none focus:bg-indigo-400">Create User</button>
                </form>
              <div  className="overflow-hidden">
                <table className='min-w-full divide-y divide-gray-200 overflow-x-auto'>
                  <thead>
                    <tr>
                      <th>
                        <div className='flex items-center h-5'>
                              <input id = "checkbox-all" type='checkbox' className='border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800' />
                              <label htmlFor= "checkbox-all" className="sr-only">Check All</label>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User_Id</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IS_ACTIVE</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {!loading&&users.map((u)=>(
                      <tr key = {u.id}>
                          <td className='py-3 ps-4'>
                            <div className='flex items-center h-5'>
                              <input id = {u.id} type='checkbox' className='border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800' />
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200'>{u.id}</td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200'>{u.first_name}</td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200'>{u.last_name}</td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200'>{u.email}</td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200'>{u.role}</td>
                          <td className='py-4 px-6 border-b border-gray-200'>
                            {u.is_active ? (
                              <>
                                <span className="bg-green-500 text-white py-1 px-2 rounded-full text-xs">Active</span>
                              </>
                            ):(
                              <>
                                <span className="bg-red-500 text-white py-1 px-2 rounded-full text-xs">Inactive</span>
                              </>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                          <button onClick={()=>handleOpenUpdateWidget(u)} className='text-indigo-600 hover:text-indigo-900'> Edit </button>
                            <span>    |     </span>
                            <button onClick={()=>handleDeleteUser(u.id)} className='text-indigo-600 hover:text-indigo-900'> Delete </button>
                          </td>
                        
                      </tr>
                    ))}
                  </tbody>
                  
                </table>
              </div>
              <div className="py-1 px-4">
                <nav className="flex items-center space-x-1">
                  <button type="button" className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                    <span aria-hidden="true">«</span>
                    <span className="sr-only">Previous</span>
                  </button>
                  <button type="button" className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10" aria-current="page">1</button>
                  <button type="button" className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10">2</button>
                  <button type="button" className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10">3</button>
                  <button type="button" className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                    <span className="sr-only">Next</span>
                    <span aria-hidden="true">»</span>
                  </button>
                </nav>
              </div>

              {selectedUser && (
                <UserUpdateWidget
                user={selectedUser}
                onClose={()=> setSelectedUser(null)}
                onSave={handleUpdateUser}
                />
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}