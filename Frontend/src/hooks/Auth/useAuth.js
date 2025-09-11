import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authServices';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    user, 
    setUser, 
    token, 
    setToken, 
    userType, 
    setUserType, 
    isAuthenticated, 
    setIsAuthenticated,
    loading: contextLoading 
  } = useContext(AuthContext);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        const { user: userData, accessToken, userType: responseUserType } = response.data;
        
        setUser(userData);
        setToken(accessToken);
        setUserType(responseUserType);
        setIsAuthenticated(true);
        
        // Store in localStorage or sessionStorage based on rememberMe
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('accessToken', accessToken);
        storage.setItem('user', JSON.stringify(userData));
        storage.setItem('userType', responseUserType);
        
        // Navigate to intended page or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
        
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

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear state regardless of API call success
      setUser(null);
      setToken(null);
      setUserType(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userType');
      navigate('/login', { replace: true });
    }
  };

  return {
    user,
    token,
    userType,
    isAuthenticated,
    login,
    logout,
    loading: loading || contextLoading,
    error,
    setError
  };
};