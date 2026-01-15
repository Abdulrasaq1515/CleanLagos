// Network utilities for CleanLagos mobile app

/**
 * Check if device is online
 * Note: For full implementation, install @react-native-community/netinfo
 * This is a basic implementation
 */
export const isOnline = async () => {
  try {
    // Basic check - try to fetch a small resource
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Retry a function with exponential backoff
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry attempt ${i + 1} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error) => {
  return !error.response && (
    error.message === 'Network Error' ||
    error.message === 'Network request failed' ||
    error.code === 'ECONNABORTED' ||
    error.code === 'ETIMEDOUT'
  );
};
