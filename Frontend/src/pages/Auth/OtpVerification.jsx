import React from 'react';
import OtpVerificationForm from '../../components/Auth/OtpVerificationform';

const OtpVerification = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <OtpVerificationForm />
      </div>
    </div>
  );
};

export default OtpVerification;