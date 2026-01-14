import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';

// Platform-agnostic storage: use localStorage in web, AsyncStorage in React Native
let storage;
if (typeof window !== 'undefined') {
  // Web environment: use localStorage
  storage = {
    getItem: (key) => Promise.resolve(localStorage.getItem(key)),
    setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
  };
} else {
  // React Native environment: will use AsyncStorage dynamically
  // (imported at runtime by the mobile app)
  storage = null;
}

import authReducer from './slices/authSlice';
import reportReducer from './slices/reportSlice';
import pspReducer from './slices/pspSlice';
import recyclerReducer from './slices/recyclerSlice';
import uiReducer from './slices/uiSlice';

// Use platform-agnostic storage (already configured above)
const storageAdapter = storage;

// Persist configurations
const authPersistConfig = {
  key: 'auth',
  storage: storageAdapter,
  whitelist: ['user', 'token', 'isAuthenticated']
};

const reportPersistConfig = {
  key: 'reports',
  storage: storageAdapter,
  whitelist: ['myReports', 'pendingReports']
};

const pspPersistConfig = {
  key: 'psp',
  storage: storageAdapter,
  whitelist: ['tasks', 'earnings', 'taskHistory']
};

const recyclerPersistConfig = {
  key: 'recycler',
  storage: storageAdapter,
  whitelist: ['tasks', 'stats', 'materials']
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  reports: persistReducer(reportPersistConfig, reportReducer),
  psp: persistReducer(pspPersistConfig, pspReducer),
  recycler: persistReducer(recyclerPersistConfig, recyclerReducer),
  ui: uiReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

console.log('Redux store created with all slices!');