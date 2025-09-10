import { useState } from 'react';
import { authService } from '../../services/authServices';

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async (email, newPassword, otp, confirmPassword) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await authService.resetPassword(email, newPassword, otp, confirmPassword);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    resetPassword,
    loading,
    error,
    success,
    setError
  };
};