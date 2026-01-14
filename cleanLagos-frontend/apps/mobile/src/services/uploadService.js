// Simple upload service stub for mobile app
import { apiClient, store } from '../store';

export const uploadImage = async (imageUri, progressCallback) => {
  // Stub implementation for mobile testing
  console.log('Upload image called with:', imageUri);
  
  // Simulate progress
  if (progressCallback) {
    progressCallback(25);
    setTimeout(() => progressCallback(50), 500);
    setTimeout(() => progressCallback(75), 1000);
    setTimeout(() => progressCallback(100), 1500);
  }
  
  return Promise.resolve({
    success: true,
    url: 'https://example.com/uploaded-image.jpg',
    message: 'Image uploaded successfully (stub)'
  });
};

export const validateImage = (imageUri) => {
  // Simple validation stub
  if (!imageUri) {
    return { ok: false, reason: 'No image provided' };
  }
  return { ok: true };
};