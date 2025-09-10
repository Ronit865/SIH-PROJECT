import React, { useState, useRef, useEffect } from 'react';
import { useOTP } from '../../hooks/Auth/useOTP';
import { useAuthNavigation } from '../../hooks/Auth/useAuthNavigation';
import { useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const OtpVerificationForm = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const inputRefs = useRef([]);
  
  const { verifyOTP, loading, error } = useOTP();
  const { navigateToForgotPassword, navigateToResetPassword } = useAuthNavigation();
  const location = useLocation();
  
  const email = location.state?.email || '';

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Clear errors when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.slice(0, 6).split('');
    
    const newOtp = [...otp];
    pastedOtp.forEach((char, index) => {
      if (index < 6 && /^\d$/.test(char)) {
        newOtp[index] = char;
      }
    });
    
    setOtp(newOtp);
    
    // Focus last filled input or next empty input
    const lastFilledIndex = newOtp.findLastIndex(char => char !== '');
    const nextEmptyIndex = newOtp.findIndex(char => char === '');
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(lastFilledIndex + 1, 5);
    
    inputRefs.current[focusIndex]?.focus();
  };

  const validateForm = () => {
    const newErrors = {};
    const otpString = otp.join('');
    
    if (!otpString || otpString.length < 6) {
      newErrors.otp = 'Please enter the complete 6-digit OTP';
    } else if (!/^\d{6}$/.test(otpString)) {
      newErrors.otp = 'OTP must contain only numbers';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const otpString = otp.join('');
      console.log('=== OTP Verification Debug ===');
  console.log('Email from location.state:', email);
  console.log('OTP entered:', otpString);
  console.log('OTP length:', otpString.length);
  console.log('OTP type:', typeof otpString);
  console.log('Expected OTP from DB: 571543');
  console.log('================================');
    
    try {
    const result = await verifyOTP(email, otpString);
    console.log('Verification result:', result);
    navigateToResetPassword(email, otpString);
  } catch (err) {
    console.error('OTP verification failed:', err);
    console.error('Error response:', err.response?.data);
    console.error('Error status:', err.response?.status);
  }
};
  const handleResendOTP = async () => {
    // TODO: Implement resend OTP functionality
    console.log('Resend OTP for:', email);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 shadow-xl border border-slate-700">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={navigateToForgotPassword}
          className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
        <p className="text-slate-400">
          We've sent a 6-digit verification code to{' '}
          <span className="text-blue-400">{email}</span>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-4">
            Enter Verification Code <span className="text-red-500">*</span>
          </label>
          <div className="flex justify-center space-x-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-lg font-semibold bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.otp ? 'border-red-500' : 'border-slate-600'
                }`}
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-sm text-red-500 text-center">{errors.otp}</p>
          )}
        </div>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-2">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResendOTP}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            Resend OTP
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Verifying...
            </div>
          ) : (
            'Verify OTP'
          )}
        </button>
      </form>
    </div>
  );
};

export default OtpVerificationForm;