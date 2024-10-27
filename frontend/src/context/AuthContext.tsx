"use client";  // Mark the component as client-side
import { getProfile } from '../services/userService';  // Correct import path
import api from '../services/axiosInstance';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// interface User {
//   id:string;
//   username: string;
//   email: string;
//   role: string; 
// }

interface AuthContextProps {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string | null;
  is_active:boolean;
  isAuthenticated: boolean;
  setIsAuthenticated:(isAuthenticated:boolean) =>void;
  setAuth: (first_name: string|null, last_name: string|null, email: string|null, role: string | null, is_active:boolean,id: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [first_name, setFirstName] = useState<string | null> (null);
  const [last_name, setLastName] = useState<string | null> (null);
  const [email, setEmail] = useState<string | null> (null);
  const [role, setRole] = useState<string | null>(null);
  const [id, setUserId] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [is_active, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true); 

  const router = useRouter();
  const setAuth = (first_name:string|null, last_name: string|null, email: string|null, role: string | null, is_active:boolean, id: string) => {
    setFirstName(first_name);
    setLastName(last_name);
    setUserId(id);
    setEmail(email);
    setRole(role);
    setIsActive(is_active);
    localStorage.setItem('user_id', id);
  };

  const checkAuth = async () => {
    try{
      const response = await getProfile();
      if(response.success){
        setAuth(response.data.data.first_name, response.data.data.last_name, response.data.data.email, response.data.data.role, response.data.data.is_active, response.data.data.user_id);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('User is not authenticated');
      setIsAuthenticated(false);
      setAuth(null, null, null, null, false, "");
    } finally{
      setLoading(false);
    }
  }
  
  useEffect(()=>{
    checkAuth();
  }, [])

  const logout = async() => {
    try{
      await api.post('logout/', {}, {withCredentials:true});
      setFirstName(null);
      setLastName(null);
      setEmail(null);
      setRole(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user_id');
      router.push('login');
    } catch(errir){
      console.error('Error Logging out:');
    }
  };

  return (
    <AuthContext.Provider value={{ first_name, last_name, email, role, is_active, id, setIsAuthenticated, isAuthenticated, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);  // Access the AuthContext
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');  // Error if used outside provider
  }
  return context;  // Return the context, including user, accessToken, setAuth, and logout
};