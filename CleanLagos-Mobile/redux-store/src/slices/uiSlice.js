import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isLoading: false,
    loadingMessage: '',
    notifications: [],
    theme: 'light',
    language: 'en',
    networkStatus: 'online',
    currentScreen: 'login',
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || '';
    },
    addNotification: (state, action) => {
      const newNotification = {
        id: Date.now(),
        type: action.payload.type || 'info',
        message: action.payload.message,
        duration: action.payload.duration || 3000,
      };
      state.notifications.push(newNotification);
      console.log('Notification added:', newNotification.message);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        n => n.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      console.log('Theme changed to:', state.theme);
    },
    setNetworkStatus: (state, action) => {
      state.networkStatus = action.payload;
      console.log('Network status:', action.payload);
    },
    setCurrentScreen: (state, action) => {
      state.currentScreen = action.payload;
    },
  },
});

export const { 
  setLoading, 
  addNotification, 
  removeNotification,
  clearAllNotifications,
  toggleTheme, 
  setNetworkStatus,
  setCurrentScreen
} = uiSlice.actions;

export default uiSlice.reducer;