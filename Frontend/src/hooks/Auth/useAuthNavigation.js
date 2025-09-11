
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToForgotPassword = () => {
    navigate('/forgot-password');
  };

  const navigateToOtpVerification = (email) => {
    navigate('/otp-verification', { 
      state: { email, from: location.pathname } 
    });
  };

  const navigateToResetPassword = (email, otp) => {
    navigate('/reset-password', { 
      state: { email, otp, from: location.pathname } 
    });
  };

  const navigateToDashboard = () => {
    const from = location.state?.from?.pathname || '/AdminDashboard';
    navigate(from, { replace: true });
  };

  return {
    navigateToLogin,
    navigateToForgotPassword,
    navigateToOtpVerification,
    navigateToResetPassword,
    navigateToDashboard
  };
};