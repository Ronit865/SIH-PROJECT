import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authServices';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser, setToken } = useContext(AuthContext);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        
        // Store in localStorage if remember me is checked
        if (rememberMe) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  return {
    login,
    logout,
    loading,
    error,
    setError
  };
};