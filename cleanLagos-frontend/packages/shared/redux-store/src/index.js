export { store, persistor } from './store';

// Auth exports
export { 
  loginUser, 
  registerUser, 
  fetchCurrentUser, 
  logout, 
  clearError,
  setMockUser,
  sendOTP,
  verifyOTP,
  resetPassword,
  changePassword,
  clearOTPState
} from './slices/authSlice';

// Report exports
export { 
  submitReport, 
  fetchMyReports, 
  addOfflineReport,
  clearOfflineReports,
  syncOfflineReports,
  deleteReport,
  deleteReportById,
  clearReportError
} from './slices/reportSlice';

// PSP exports
export { 
  fetchMyTasks, 
  acceptTask, 
  completeTask,
  fetchTaskHistory,
  updateTaskStatus,
  updateEarnings,
  clearPspError
} from './slices/pspSlice';

// Recycler exports
export {
  fetchRecyclingTasks,
  completeRecyclingTask,
  clearRecyclerError,
  updateMaterialStats
} from './slices/recyclerSlice';

// UI exports
export { 
  setLoading, 
  addNotification, 
  removeNotification,
  clearAllNotifications,
  toggleTheme,
  setNetworkStatus,
  setCurrentScreen
} from './slices/uiSlice';

console.log('Redux store exports ready');