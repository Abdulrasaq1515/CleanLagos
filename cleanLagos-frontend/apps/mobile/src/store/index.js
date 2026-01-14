export { store, persistor } from './store';

// Auth exports
export {
  loginUser,
  registerUser,
  fetchCurrentUser,
  logout,
  clearError,
  setMockUser,
  clearOTPState,
} from './slices/authSlice';

// UI exports
export {
  setLoading,
  addNotification,
  removeNotification,
  clearAllNotifications,
  toggleTheme,
  setNetworkStatus,
  setCurrentScreen,
} from './slices/uiSlice';

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUI = (state) => state.ui;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectNotifications = (state) => state.ui.notifications;
export const selectTheme = (state) => state.ui.theme;
export const selectNetworkStatus = (state) => state.ui.networkStatus;

// Mock API client for backward compatibility
export const apiClient = {
  get: (url) => {
    console.log('Mock API GET:', url);
    return Promise.resolve({ data: {} });
  },
  post: (url, data) => {
    console.log('Mock API POST:', url, data);
    return Promise.resolve({ data: {} });
  },
  put: (url, data) => {
    console.log('Mock API PUT:', url, data);
    return Promise.resolve({ data: {} });
  },
  delete: (url) => {
    console.log('Mock API DELETE:', url);
    return Promise.resolve({ data: {} });
  },
};

console.log('✅ Redux store exports ready with proper actions and selectors');