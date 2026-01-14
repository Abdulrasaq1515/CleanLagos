// packages/shared/redux-store/src/services/api.js
import axios from 'axios';

// Mock API client for development
export const apiClient = {
  // Authentication
  login: async (email, password) => {
    console.log('API: Logging in with', email);
    return { user: { id: '1', email, role: 'citizen' }, token: 'mock-token' };
  },
  
  register: async (userData) => {
    console.log('API: Registering user', userData.email);
    return { user: { id: '2', ...userData, role: 'citizen' }, token: 'mock-token' };
  },
  
  // Reports
  submitReport: async (reportData) => {
    console.log('API: Submitting report at', reportData.location.address);
    return { id: 'report_1', ...reportData, status: 'pending' };
  },
  
  getMyReports: async () => {
    console.log('API: Fetching user reports');
    return [];
  },
  
  // For testing - simulate network error
  simulateError: async () => {
    throw new Error('Simulated network error');
  },
  
  // For testing - simulate success
  simulateSuccess: async (data) => {
    return { success: true, data };
  }
};

// Real axios instance (commented out for now)
/*
export const realApiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  timeout: 15000,
});
*/

console.log('API service initialized (mock mode)');