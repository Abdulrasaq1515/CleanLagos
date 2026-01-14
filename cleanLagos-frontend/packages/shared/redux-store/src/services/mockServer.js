/**
 * Mock Server Configuration
 * For local development and testing when real backend is not ready
 * Switch between mock and real API via environment variable
 */

import axios from 'axios';

const MOCK_DELAY = 1000; // Simulate network latency

/**
 * Mock API responses for development
 */
export const mockApi = {
  // Auth endpoints
  login: async (credentials) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return {
      token: 'mock_token_' + Date.now(),
      user: {
        id: 'user_' + Date.now(),
        phone: credentials.phone,
        role: credentials.role || 'citizen',
        name: 'Test User',
      },
    };
  },

  register: async (data) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    if (data.phone && !data.phone.startsWith('+234')) {
      throw new Error('Phone number must be in format +234XXXXXXXXXX');
    }
    return {
      token: 'mock_token_' + Date.now(),
      user: {
        id: 'user_' + Date.now(),
        phone: data.phone,
        role: data.role || 'citizen',
        name: data.name,
      },
    };
  },

  sendOTP: async (phone) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    if (!phone.startsWith('+234')) {
      throw new Error('Phone number must be in format +234XXXXXXXXXX');
    }
    console.log(`[MOCK] OTP sent to ${phone}: 1234`);
    return {
      success: true,
      message: 'OTP sent to your phone',
      expiresIn: 300, // 5 minutes
    };
  },

  verifyOTP: async (phone, otp) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    if (otp === '1234') {
      return { success: true, token: 'mock_token_' + Date.now() };
    }
    throw new Error('Invalid OTP');
  },

  resetPassword: async (phone, newPassword) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return { success: true, message: 'Password reset successful' };
  },

  changePassword: async (oldPassword, newPassword) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    if (oldPassword === 'wrong') throw new Error('Current password is incorrect');
    return { success: true, message: 'Password changed' };
  },

  // Report endpoints
  submitReport: async (reportData) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY * 1.5));
    
    // Simulate validation: check if images contain waste (mock AI detection)
    if (reportData.images && reportData.images.length === 0) {
      const error = new Error('At least one image is required');
      error.status = 400;
      throw error;
    }
    
    return {
      id: 'report_' + Date.now(),
      ...reportData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      pointsAwarded: 10,
    };
  },

  getMyReports: async () => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return [
      {
        id: 'report_1',
        location: { address: 'Lagos Island', coordinates: { lat: 6.5244, lng: 3.3792 } },
        images: ['image1.jpg'],
        description: 'Plastic waste',
        wasteType: 'plastic',
        urgency: 'high',
        status: 'verified',
        pointsAwarded: 10,
        createdAt: '2024-01-10T10:00:00Z',
      },
    ];
  },

  deleteReport: async (reportId) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return { success: true, reportId };
  },

  // Image upload endpoint
  uploadImage: async (formData) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY * 0.5));
    return {
      url: 'https://mock-storage.cleanlagos.com/images/img_' + Date.now() + '.jpg',
      size: Math.floor(Math.random() * 2000000),
      uploadedAt: new Date().toISOString(),
    };
  },

  // PSP/Worker endpoints
  getMyTasks: async () => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return [
      {
        id: 'task_1',
        reportId: 'report_1',
        location: { address: 'Lagos Island', coordinates: { lat: 6.5244, lng: 3.3792 } },
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ];
  },

  acceptTask: async (taskId) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return { success: true, taskId, status: 'accepted' };
  },

  completeTask: async (taskId, completionData) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY * 1.5));
    return {
      success: true,
      taskId,
      status: 'completed',
      pointsAwarded: 25,
    };
  },

  // Push notification registration
  registerDeviceToken: async (token, platform) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY * 0.5));
    console.log(`[MOCK] Device registered for ${platform}: ${token}`);
    return { success: true };
  },

  // Analytics endpoints
  getAnalytics: async () => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return {
      totalReports: 1234,
      pendingReports: 123,
      completedReports: 1000,
      totalPoints: 50000,
      wasteByType: [
        { type: 'plastic', count: 500, percentage: 40 },
        { type: 'organic', count: 400, percentage: 32 },
        { type: 'metal', count: 200, percentage: 16 },
        { type: 'other', count: 134, percentage: 12 },
      ],
    };
  },

  getHeatmapData: async () => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return [
      { lat: 6.5244, lng: 3.3792, intensity: 50, address: 'Lagos Island' },
      { lat: 6.4281, lng: 3.4215, intensity: 35, address: 'Victoria Island' },
      { lat: 6.4522, lng: 3.4350, intensity: 25, address: 'Ikoyi' },
      { lat: 6.4969, lng: 3.3608, intensity: 40, address: 'Lekki' },
    ];
  },
};

/**
 * Create axios instance configured for mock or real API
 */
export const createApiClient = (useMock = true) => {
  if (useMock) {
    return mockApi;
  }

  // Real API client setup
  return axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Get current API mode from environment
 */
export const getApiMode = () => {
  const mode = process.env.REACT_APP_API_MODE || 'mock';
  console.log(`[API] Using ${mode} mode`);
  return mode;
};

/**
 * Switch API mode (for development)
 */
let currentMode = getApiMode();
export const setApiMode = (mode) => {
  currentMode = mode;
  console.log(`[API] Switched to ${mode} mode`);
};

export const getCurrentApiMode = () => currentMode;
