// Frontend validation utilities matching backend Joi schemas

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phone) return 'Phone number is required';
  if (!phoneRegex.test(phone.replace(/[\s\-\+]/g, ''))) {
    return 'Phone number must be 10-15 digits';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateFullName = (fullName) => {
  if (!fullName) return 'Full name is required';
  if (fullName.trim().length < 2) return 'Full name must be at least 2 characters';
  return null;
};

export const validateEmail = (email) => {
  if (!email) return null; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
};

export const validateRole = (role) => {
  const validRoles = ['citizen', 'psp', 'recycler', 'lawma_admin', 'system_admin'];
  if (!validRoles.includes(role)) return 'Invalid role';
  return null;
};

export const validateReportTitle = (title) => {
  if (!title) return 'Title is required';
  if (title.length < 5) return 'Title must be at least 5 characters';
  if (title.length > 200) return 'Title must not exceed 200 characters';
  return null;
};

export const validateLocation = (location) => {
  if (!location) return 'Location is required';
  if (!location.coordinates || !Array.isArray(location.coordinates)) {
    return 'Invalid location format';
  }
  if (location.coordinates.length !== 2) {
    return 'Location must have longitude and latitude';
  }
  const [lng, lat] = location.coordinates;
  if (typeof lng !== 'number' || typeof lat !== 'number') {
    return 'Coordinates must be numbers';
  }
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
    return 'Invalid coordinates range';
  }
  return null;
};

export const validateCategory = (category) => {
  const validCategories = ['household', 'industrial', 'construction', 'medical', 'recyclable', 'other'];
  if (!validCategories.includes(category)) return 'Invalid category';
  return null;
};

export const validateSeverity = (severity) => {
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  if (!validSeverities.includes(severity)) return 'Invalid severity level';
  return null;
};

// Composite validation functions
export const validateRegistration = (data) => {
  const errors = {};
  
  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  const fullNameError = validateFullName(data.fullName);
  if (fullNameError) errors.fullName = fullNameError;
  
  if (data.email) {
    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;
  }
  
  if (data.role) {
    const roleError = validateRole(data.role);
    if (roleError) errors.role = roleError;
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateLogin = (data) => {
  const errors = {};
  
  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateWasteReport = (data) => {
  const errors = {};
  
  const titleError = validateReportTitle(data.title);
  if (titleError) errors.title = titleError;
  
  const locationError = validateLocation(data.location);
  if (locationError) errors.location = locationError;
  
  if (data.category) {
    const categoryError = validateCategory(data.category);
    if (categoryError) errors.category = categoryError;
  }
  
  if (data.severity) {
    const severityError = validateSeverity(data.severity);
    if (severityError) errors.severity = severityError;
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};
