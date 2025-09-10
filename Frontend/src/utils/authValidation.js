export const validateEmail = (email) => {
  const errors = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return errors;
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  }
  
  return errors;
};

export const validateOTP = (otp) => {
  const errors = [];
  
  if (!otp) {
    errors.push('OTP is required');
  } else if (!/^\d{6}$/.test(otp)) {
    errors.push('OTP must be a 6-digit number');
  }
  
  return errors;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  const errors = [];
  
  if (!confirmPassword) {
    errors.push('Please confirm your password');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return errors;
};

export const validateLoginForm = (email, password) => {
  return {
    email: validateEmail(email),
    password: password ? [] : ['Password is required']
  };
};

export const validateRegistrationForm = (formData) => {
  return {
    email: validateEmail(formData.email),
    password: validatePassword(formData.password),
    confirmPassword: validatePasswordMatch(formData.password, formData.confirmPassword)
  };
};