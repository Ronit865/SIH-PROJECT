import React from 'react';
import ForgotPasswordForm from '../../components/Auth/ForgotPasswordForm';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;