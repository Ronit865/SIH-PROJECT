import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle your ApiResponse and ApiError format
api.interceptors.response.use(
  (response) => {
    // Your backend returns data in ApiResponse format
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle ApiError format from your backend
    if (error.response?.data) {
      const apiError = error.response.data;
      
      // Check if it's a 401 unauthorized error and attempt token refresh
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const refreshResponse = await api.post('/users/refresh-token');
          
          // Handle your ApiResponse format
          if (refreshResponse.data.success && refreshResponse.data?.accessToken) {
            localStorage.setItem('accessToken', refreshResponse.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      }
      
      // Create a structured error object matching your ApiError format
      const structuredError = {
        statusCode: apiError.statusCode || error.response.status,
        message: apiError.message || "Something went wrong",
        errors: apiError.errors || [],
        success: false
      };
      
      return Promise.reject(structuredError);
    }
    
    // Handle network errors or other issues
    return Promise.reject({
      statusCode: 500,
      message: error.message || "Network error occurred",
      errors: [],
      success: false
    });
  }
);

export default api;