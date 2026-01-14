import axios from 'axios';

// Get API URL from environment variable
const API_URL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  verifyPhone: (data) => api.post('/auth/verify-phone', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Reports API
export const reportsAPI = {
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images' && Array.isArray(data[key])) {
        data[key].forEach(image => formData.append('images', image));
      } else if (key === 'location') {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getAll: (params) => api.get('/reports', { params }),
  assign: (id, data) => api.post(`/reports/${id}/assign`, data),
  updateStatus: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'proof' && Array.isArray(data[key])) {
        data[key].forEach(file => formData.append('proof', file));
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.put(`/reports/${id}/status`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default api;
