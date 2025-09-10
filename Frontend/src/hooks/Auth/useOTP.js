import { useState } from 'react';
import { authService } from '../../services/authServices';

export const useOTP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verified, setVerified] = useState(false);

  const verifyOTP = async (email, otp) => {
    setLoading(true);
    setError(null);
    setVerified(false);
    
    try {
      const response = await authService.verifyOTP(email, otp);
      
      if (response.success) {
        setVerified(true);
        return response.data;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.forgotPassword(email);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyOTP,
    resendOTP,
    loading,
    error,
    verified,
    setError
  };
};