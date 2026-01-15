export { store, persistor } from './store';

// Auth exports
export {
  registerUser,
  verifyPhone,
  loginUser,
  fetchCurrentUser,
  logout,
  clearError as clearAuthError,
  setRegistrationStep,
} from './slices/authSlice';

// Reports exports
export {
  createReport,
  fetchReports,
  assignReport,
  updateReportStatus,
  clearError as clearReportError,
  setFilters,
  clearFilters,
} from './slices/reportSlice';

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
export const selectReports = (state) => state.reports;
export const selectUI = (state) => state.ui;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAllReports = (state) => state.reports.reports;
export const selectReportsPagination = (state) => state.reports.pagination;
export const selectReportsLoading = (state) => state.reports.loading;
export const selectNotifications = (state) => state.ui.notifications;
export const selectTheme = (state) => state.ui.theme;
export const selectNetworkStatus = (state) => state.ui.networkStatus;
