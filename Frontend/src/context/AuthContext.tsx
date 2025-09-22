import React, { createContext, useContext, useEffect, useState } from 'react';
import { userService, handleApiError, handleApiSuccess } from '@/services/ApiServices';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: any) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await userService.getCurrentUser();
      
      if (response.success) {
        const successData = handleApiSuccess(response);
        setUser(successData.data);
      }
    } catch (error: any) {
      const apiError = handleApiError(error);
      console.error('Failed to fetch current user:', apiError.message);
      
      // If token is invalid, remove it
      if (apiError.statusCode === 401) {
        localStorage.removeItem('accessToken');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: any) => {
    setUser(userData.user);
    if (userData.accessToken) {
      localStorage.setItem('accessToken', userData.accessToken);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};