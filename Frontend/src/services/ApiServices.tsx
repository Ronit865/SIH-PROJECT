import { ref } from 'process';
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
    return await api.post('/login', credentials);
  },
  
  logout: async (): Promise<ApiResponse> => {
    return await api.post('/logout');
  },
  
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    return await api.post('/forgot-password', { email });
  },
  
  verifyOTP: async (email: string, otp: string): Promise<ApiResponse> => {
    return await api.post('/verify-otp', { email, otp });
  },

  refreshAccessToken: async (refreshToken: string): Promise<ApiResponse> => {
    return await api.post('/refresh-token', { token: refreshToken });
  },
  
  resetPassword: async (email: string, newPassword: string, otp: string): Promise<ApiResponse> => {
    return await api.post('/reset-password', { 
      email, 
      newPassword, 
      otp 
    });
  }
};

// User Services
export const userService = {
  getCurrentUser: async (): Promise<ApiResponse> => {
    return await api.get('/users/user');
  },
  
  updateProfile: async (data: any): Promise<ApiResponse> => {
    return await api.patch('/users/update-user', data);
  },
  
  updateAvatar: async (formData: FormData): Promise<ApiResponse> => {
    return await api.post('/users/update-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  changePassword: async (data: { 
    oldPassword: string; 
    newPassword: string; 
  }): Promise<ApiResponse> => {
    return await api.post('/users/change-password', data);
  }
};



// Events Services
export const eventService = {
  getEvents: async (): Promise<ApiResponse> => {
    return await api.get('/events/getEvents');
  },
  
  createEvent: async (eventData: any): Promise<ApiResponse> => {
    return await api.post('/events/addEvent', eventData);
  },
  
  updateEvent: async (id: string, eventData: any): Promise<ApiResponse> => {
    return await api.patch(`/events/editEvent/${id}`, eventData);
  },
  
  deleteEvent: async (id: string): Promise<ApiResponse> => {
    return await api.delete(`/events/deleteEvent/${id}`);
  },
  
  joinEvent: async (eventId: string): Promise<ApiResponse> => {
    return await api.post(`/events/addUserToEvent/${eventId}`);
  },
  
  leaveEvent: async (eventId: string): Promise<ApiResponse> => {
    return await api.post(`/events/removeUserFromEvent/${eventId}`);
  }
};

// Admin Services
export const adminService = {

   getCurrentAdmin: async (): Promise<ApiResponse> => {
    return await api.get('/admin/current-admin');
  },
  
  uploadCSV: async (formData: FormData): Promise<ApiResponse> => {
    return await api.post('/admin/addcsv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getAllUsers: async (): Promise<ApiResponse> => {
    const response = await api.get('/admin/user');
    return response.data;
  },
  

// getAllUsers: async (): Promise<ApiResponse> => {
//     // Remove .data from here - it should return the full response
//     return await api.get('/admin/user');
//   },

  editUserDetails: async (userId: string, data: any): Promise<ApiResponse> => {
    return await api.patch(`/admin/editdetails/${userId}`, data);
  },
  
  deleteUser: async (userId: string): Promise<ApiResponse> => {
    return await api.delete(`/admin/deleteuser/${userId}`);
  },
  
  changeAdminPassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    return await api.post('/admin/change-password', data);
  },
  
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    return await api.post('/admin/forgot-password', { email });
  },
  
  verifyOTP: async (email: string, otp: string): Promise<ApiResponse> => {
    return await api.post('/admin/verify-otp', { email, otp });
  },
  
  resetPassword: async (email: string, newPassword: string, otp: string): Promise<ApiResponse> => {
    return await api.post('/admin/reset-password', { 
      email, 
      newPassword, 
      otp 
    });
  }
};

// Donation Services
export const donationService = {
  getCampaigns: async (): Promise<ApiResponse> => {
    return await api.get('/donations/getDonations');
  },
  
  createCampaign: async (campaignData: {
    name: string;        // Changed from 'title' to 'name'
    description: string;
    goal: number;        // Changed from 'amount' to 'goal'
  }): Promise<ApiResponse> => {
    return await api.post('/donations/addDonation', campaignData);
  },
  
  updateCampaign: async (id: string, campaignData: {
    name: string;        // Changed from 'title' to 'name'
    description: string;
    goal: number;        // Changed from 'amount' to 'goal'
  }): Promise<ApiResponse> => {
    return await api.patch(`/donations/editDonation/${id}`, campaignData);
  },
  
  deleteCampaign: async (id: string): Promise<ApiResponse> => {
    return await api.delete(`/donations/deleteDonation/${id}`);
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
