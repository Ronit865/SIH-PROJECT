import { useState } from 'react';
import { authService } from '../../services/authServices';

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setSuccess(true);
        return response.data;
      } else {
        // Handle case where response is not successful
        const errorMessage = response.message || 'Failed to send OTP. Please try again.';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Forgot password error:', err); // For debugging
      
      // Extract error message from different possible sources
      const errorMessage = 
        err.response?.data?.message || 
        err.message || 
        'Failed to send OTP. Please try again.';
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    forgotPassword,
    loading,
    error,
    success,
    setError,
    clearError
  };
};