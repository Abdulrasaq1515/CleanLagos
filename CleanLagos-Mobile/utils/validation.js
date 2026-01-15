// Validation utilities for CleanLagos mobile app

/**
 * Validate Nigerian phone number format
 * Accepts: 08012345678, +2348012345678, 2348012345678
 */
export const validatePhoneNumber = (phone) => {
  if (!phone) return { valid: false, message: 'Phone number is required' };
  
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Nigerian phone number patterns
  const patterns = [
    /^0[7-9][0-1]\d{8}$/,           // 08012345678
    /^\+234[7-9][0-1]\d{8}$/,       // +2348012345678
    /^234[7-9][0-1]\d{8}$/,         // 2348012345678
  ];
  
  const isValid = patterns.some(pattern => pattern.test(cleaned));
  
  if (!isValid) {
    return {
      valid: false,
      message: 'Invalid phone number. Use format: 08012345678'
    };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (!password) return { valid: false, message: 'Password is required' };
  
  if (password.length < 6) {
    return {
      valid: false,
      message: 'Password must be at least 6 characters'
    };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email) return { valid: true, message: '' }; // Email is optional
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailPattern.test(email)) {
    return {
      valid: false,
      message: 'Invalid email format'
    };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate full name
 */
export const validateFullName = (name) => {
  if (!name) return { valid: false, message: 'Full name is required' };
  
  if (name.trim().length < 2) {
    return {
      valid: false,
      message: 'Name must be at least 2 characters'
    };
  }
  
  return { valid: true, message: '' };
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  return input.trim().replace(/[<>]/g, '');
};
