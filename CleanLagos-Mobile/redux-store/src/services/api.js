import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Platform detection
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

// Storage abstraction
const storage = {
  getItem: async (key) => {
    if (isReactNative) {
      return await AsyncStorage.getItem(key);
    }
    return localStorage.getItem(key);
  },
  setItem: async (key, value) => {
    if (isReactNative) {
      return await AsyncStorage.setItem(key, value);
    }
    return localStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    if (isReactNative) {
      return await AsyncStorage.removeItem(key);
    }
    return localStorage.removeItem(key);
  },
};

// Get API URL using Expo Constants for proper env loading
const getApiUrl = () => {
  // Try Expo Constants first (proper way for React Native)
  const expoExtra = Constants.expoConfig?.extra;
  if (expoExtra?.apiUrl) {
    console.log('📡 API URL from expo config:', expoExtra.apiUrl);
    return expoExtra.apiUrl;
  }
  
  // Try process.env
  if (typeof process !== 'undefined' && process.env) {
    const envUrl = process.env.REACT_APP_API_URL || process.env.VITE_API_URL;
    if (envUrl) {
      console.log('📡 API URL from process.env:', envUrl);
      return envUrl;
    }
  }
  
  // Fallback
  const fallback = 'http://localhost:5000/api';
  console.log('📡 API URL fallback:', fallback);
  return fallback;
};

const API_URL = getApiUrl();
console.log('🔧 API Service initialized with URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Request with auth token:', config.method.toUpperCase(), config.url);
    } else {
      console.log('📤 Request without auth:', config.method.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response success:', response.config.method.toUpperCase(), response.config.url, response.status);
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const originalRequest = error.config;
    
    console.error('❌ Response error:', {
      status,
      url,
      message: error.response?.data?.message || error.message
    });
    
    // Handle specific error codes
    if (status === 401) {
      console.log('🔓 Unauthorized - clearing token');
      await storage.removeItem('token');
      if (!isReactNative && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      error.message = 'Access denied. You do not have permission.';
    } else if (status === 404) {
      error.message = 'Resource not found.';
    } else if (status === 500) {
      error.message = 'Server error. Please try again later.';
    } else if (status === 429) {
      error.message = 'Too many requests. Please wait a moment.';
    } else if (!error.response) {
      // Network error
      error.message = 'Network error. Please check your connection.';
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      error.message = 'Request timed out. Please try again.';
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
