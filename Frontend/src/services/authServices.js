import api from '../api.jsx';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/api/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    const response = await api.post('/api/logout');
    return response.data;
  },

  // Fix: Add separate admin endpoints
  forgotPassword: async (email, userType = 'user') => {
    const endpoint = userType === 'admin' ? '/api/admin/forgot-password' : '/api/users/forgot-password';
    const response = await api.post(endpoint, { email });
    return response.data;
  },

  verifyOTP: async (email, otp, userType = 'user') => {
    const endpoint = userType === 'admin' ? '/api/admin/verify-otp' : '/api/users/verify-otp';
    const response = await api.post(endpoint, { email, otp });
    return response.data;
  },

  resetPassword: async (email, newPassword, otp, confirmPassword, userType = 'user') => {
    const endpoint = userType === 'admin' ? '/api/admin/reset-password' : '/api/users/reset-password';
    const response = await api.post(endpoint, {
      email,
      otp,
      newPassword,
      confirmPassword
    });
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/api/users/refresh-token');
    return response.data;
  },

  // Fix: Correct profile endpoints
  getProfile: async () => {
    const response = await api.get('/api/users/user');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.patch('/api/users/update-user', userData);
    return response.data;
  }
};

// Separate admin service
export const adminService = {
  forgotPassword: async (email) => {
    const response = await api.post('/api/admin/forgot-password', { email });
    return response.data;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post('/api/admin/verify-otp', { email, otp });
    return response.data;
  },

  resetPassword: async (email, newPassword, otp, confirmPassword) => {
    const response = await api.post('/api/admin/reset-password', {
      email,
      token: otp, // Note: admin uses 'token' instead of 'otp'
      newPassword,
      confirmPassword
    });
    return response.data;
  }
};

// Fix event service endpoints
export const eventService = {
  createEvent: async (eventData) => {
    const response = await api.post('/api/events/addEvent', eventData);
    return response.data;
  },

  getAllEvents: async () => {
    const response = await api.get('/api/events/getEvents');
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.patch(`/api/events/editEvent/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/api/events/deleteEvent/${id}`);
    return response.data;
  },

  joinEvent: async (eventId) => {
    const response = await api.post(`/api/events/addUserToEvent/${eventId}`);
    return response.data;
  },

  leaveEvent: async (eventId) => {
    const response = await api.post(`/api/events/removeUserFromEvent/${eventId}`);
    return response.data;
  }
};