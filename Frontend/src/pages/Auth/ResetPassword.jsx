
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResetPasswordForm from '../../components/Auth/ResetPasswordForm';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const otp = location.state?.otp;

  const handleSuccess = () => {
    alert('Password reset successfully!');
    navigate('/login');
  };

  if (!email) {
    navigate('/forgot-password');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900  sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <ResetPasswordForm email={email} otp={otp} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default ResetPassword;