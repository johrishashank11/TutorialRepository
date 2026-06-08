import axios from 'axios';
import { getToken, clearAuth } from '../utils/tokenUtils';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Gateway URL
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Unpack standard ApiResponse wrapper if present
    if (response.data && response.data.success !== undefined) {
      if (!response.data.success) {
        return Promise.reject(new Error(response.data.message));
      }
      return response.data; // Return the inner unwrapped payload
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAuth();
      window.location.href = '/login'; // Force redirect
    }

    // Extract backend error message if standard ApiResponse
    const errorMessage = error.response?.data?.message || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
