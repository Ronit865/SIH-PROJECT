import api from '../api.jsx';

export const authService = {
  // User authentication
    login: async (email, password) => {
    try {
      const response = await api.post('/api/admin/Adminlogin', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  signup: async (userData) => {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/users/logout');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/api/users/forgot-password', { email });
    return response.data;
  },

   verifyOTP: async (email, otp) => {
    const response = await api.post('/api/users/verify-otp', { email, otp });
    return response.data;
  },

  resetPassword: async (email, newPassword, otp, confirmPassword) => {
    const response = await api.post('/api/users/reset-password', {
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

  // Profile management
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/api/users/profile', userData);
    return response.data;
  },

  deleteProfile: async () => {
    const response = await api.delete('/api/users/profile');
    return response.data;
  }
};

// Admin authentication (if needed)
export const adminService = {
  login: async (email, password) => {
    const response = await api.post('/api/admin/login', { email, password });
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post('/api/admin/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/admin/logout');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/api/admin/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (email, newPassword, otp, confirmPassword) => {
    const response = await api.post('/api/admin/reset-password', {
      email,
      otp,
      newPassword,
      confirmPassword
    });
    return response.data;
  }
};

// Event services
export const eventService = {
  createEvent: async (eventData) => {
    const response = await api.post('/api/events/create', eventData);
    return response.data;
  },

  getAllEvents: async () => {
    const response = await api.get('/api/events/all');
    return response.data;
  },

  getEvent: async (id) => {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/api/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
  }
};