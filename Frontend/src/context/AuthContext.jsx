import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType') || sessionStorage.getItem('userType');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!token && !!user);
  }, [token, user]);

  const value = {
    user,
    setUser,
    token,
    setToken,
    userType,
    setUserType,
    isAuthenticated,
    loading,
    setIsAuthenticated,
    setLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};