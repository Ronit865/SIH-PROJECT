import api from '../api';

// Type definitions matching your backend response format
interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

interface ApiError {
  statusCode: number;
  message: string;
  errors: string[];
  success: false;
} 


// Auth Services
export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse> => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
  
  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/logout');
    return response.data;
  },
  
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await api.post('/users/forgot-password', { email });
    return response.data;
  },
  
  verifyOTP: async (email: string, otp: string): Promise<ApiResponse> => {
    const response = await api.post('/users/verify-otp', { email, otp });
    return response.data;
  },
  
  resetPassword: async (email: string, newPassword: string, otp: string): Promise<ApiResponse> => {
    const response = await api.post('/users/reset-password', { 
      email, 
      newPassword, 
      otp 
    });
    return response.data;
  }
};

// User Services
export const userService = {
  getCurrentUser: async (): Promise<ApiResponse> => {
    const response = await api.get('/users/user');
    return response.data;
  },
  
  updateProfile: async (data: any): Promise<ApiResponse> => {
    const response = await api.patch('/users/update-user', data);
    return response.data;
  },
  
  updateAvatar: async (formData: FormData): Promise<ApiResponse> => {
    const response = await api.post('/users/update-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  changePassword: async (data: { 
    oldPassword: string; 
    newPassword: string; 
  }): Promise<ApiResponse> => {
    const response = await api.post('/users/change-password', data);
    return response.data;
  }
};



// Events Services
export const eventService = {
  getEvents: async (): Promise<ApiResponse> => {
    const response = await api.get('/events/getEvents');
    return response.data;
  },
  
  createEvent: async (eventData: any): Promise<ApiResponse> => {
    const response = await api.post('/events/addEvent', eventData);
    return response.data;
  },
  
  updateEvent: async (id: string, eventData: any): Promise<ApiResponse> => {
    const response = await api.patch(`/events/editEvent/${id}`, eventData);
    return response.data;
  },
  
  deleteEvent: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/events/deleteEvent/${id}`);
    return response.data;
  },
  
  joinEvent: async (eventId: string): Promise<ApiResponse> => {
    const response = await api.post(`/events/addUserToEvent/${eventId}`);
    return response.data;
  },
  
  leaveEvent: async (eventId: string): Promise<ApiResponse> => {
    const response = await api.post(`/events/removeUserFromEvent/${eventId}`);
    return response.data;
  }
};

// Admin Services
export const adminService = {
  uploadCSV: async (formData: FormData): Promise<ApiResponse> => {
    const response = await api.post('/admin/addcsv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  getAllUsers: async (): Promise<ApiResponse> => {
    const response = await api.get('/admin/user');
    return response.data;
  },
  
  editUserDetails: async (userId: string, data: any): Promise<ApiResponse> => {
    const response = await api.patch(`/admin/editdetails/${userId}`, data);
    return response.data;
  },
  
  changeAdminPassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    const response = await api.post('/admin/change-password', data);
    return response.data;
  },
  
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await api.post('/admin/forgot-password', { email });
    return response.data;
  },
  
  verifyOTP: async (email: string, otp: string): Promise<ApiResponse> => {
    const response = await api.post('/admin/verify-otp', { email, otp });
    return response.data;
  },
  
  resetPassword: async (email: string, newPassword: string, otp: string): Promise<ApiResponse> => {
    const response = await api.post('/admin/reset-password', { 
      email, 
      newPassword, 
      otp 
    });
    return response.data;
  }
};

// Error handler utility
export const handleApiError = (error: ApiError) => {
  console.error('API Error:', error);
  
  return {
    message: error.message || 'An unexpected error occurred',
    errors: error.errors || [],
    statusCode: error.statusCode || 500
  };
};

// Success handler utility
export const handleApiSuccess = (response: ApiResponse) => {
  return {
    data: response.data,
    message: response.message,
    statusCode: response.statusCode
  };

};
