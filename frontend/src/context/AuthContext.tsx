"use client";  // Mark the component as client-side

import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id:string;
  username: string;
  email: string;
  role: string; // 'admin' or 'user'
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null> (null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (token: string, userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    // Save token to localStorage (or cookie) for persistence
    localStorage.setItem('authToken', token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authToken');
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};