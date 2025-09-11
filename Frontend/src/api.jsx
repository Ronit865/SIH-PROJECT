import axios from "axios";

const api = axios.create({
  // baseURL: "/", // goes through Vite proxy
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers : {
    'Content-Type':'application/json'
  }
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userType');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);


export default api;
