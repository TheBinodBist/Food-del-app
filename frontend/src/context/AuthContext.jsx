// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { StoreContext } from './StoreContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { setToken } = useContext(StoreContext)
  const [auth, setAuth] = useState(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  // login expects an object with at least: token, role, email, name
  const login = (userData) => {
    setAuth(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem("token", userData.token)
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setToken("");
    setAuth({
      isAuthenticated: false,
      userRole: null,
      user: null
    });
    window.location.href = "/"; // Force a complete reload and redirect
  };

  const value = {
    user: auth,
    token: auth?.token || null,
    login,
    logout,
    isAuthenticated: !!auth,
    userRole: auth ? auth.role : null,
    userEmail: auth ? auth.email : null,
    userName: auth ? auth.name : null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};