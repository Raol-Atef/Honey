import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000/api';
export const UPLOADS_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Optionally redirect to login
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to get image URL
export const getImageUrl = (path: string | undefined): string => {
  if (!path) return '/placeholder-product.png';
  if (path.startsWith('http')) return path;
  return `${UPLOADS_BASE_URL}${path}`;
};

export default api;
