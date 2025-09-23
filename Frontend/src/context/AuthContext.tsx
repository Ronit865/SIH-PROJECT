import React, { createContext, useContext, useEffect, useState } from 'react';
import { userService, adminService, handleApiError, handleApiSuccess } from '@/services/ApiServices';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface Admin {
  name: string;
  _id: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  login: (userData: any) => void;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: 'user' | 'admin' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [userType, setUserType] = useState<'user' | 'admin' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUserType = localStorage.getItem('userType') as 'user' | 'admin' | null;
    
    if (token && storedUserType) {
      setUserType(storedUserType);
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const storedUserType = localStorage.getItem('userType') as 'user' | 'admin' | null;
      
      if (!storedUserType) {
        return;
      }

      let response;
      if (storedUserType === 'admin') {
        response = await adminService.getCurrentAdmin();
        if (response.success) {
          const successData = handleApiSuccess(response);
          setAdmin(successData.data);
          setUser(null);
        }
      } else {
        response = await userService.getCurrentUser();
        if (response.success) {
          const successData = handleApiSuccess(response);
          setUser(successData.data);
          setAdmin(null);
        }
      }
      
      setUserType(storedUserType);
    } catch (error: any) {
      const apiError = handleApiError(error);
      console.error('Failed to fetch current user:', apiError.message);
      
      // If token is invalid, remove it
      if (apiError.statusCode === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userType');
        setUser(null);
        setAdmin(null);
        setUserType(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: any) => {
    const { userType: responseUserType, user: responseUser, admin: responseAdmin } = userData;
    
    // Store user type and access token
    if (responseUserType) {
      localStorage.setItem('userType', responseUserType);
      setUserType(responseUserType);
    }
    
    if (userData.accessToken) {
      localStorage.setItem('accessToken', userData.accessToken);
    }

    // Set appropriate user/admin data
    if (responseUserType === 'admin' && responseAdmin) {
      setAdmin(responseAdmin);
      setUser(null);
    } else if (responseUserType === 'user' && responseUser) {
      setUser(responseUser);
      setAdmin(null);
    } else if (userData.user) {
      // Fallback for existing login format
      setUser(userData.user);
      setAdmin(null);
    }
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
    setUserType(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userType');
  };

  const value = {
    user,
    admin,
    userType,
    login,
    logout,
    fetchCurrentUser,
    isLoading,
    isAuthenticated: !!(user || admin),
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