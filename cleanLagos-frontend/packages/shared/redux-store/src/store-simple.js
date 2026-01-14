import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import authReducer from './slices/authSlice';
import reportReducer from './slices/reportSlice';
import pspReducer from './slices/pspSlice';
import recyclerReducer from './slices/recyclerSlice';
import uiReducer from './slices/uiSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  reports: reportReducer,
  psp: pspReducer,
  recycler: recyclerReducer,
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

console.log('Simple Redux store created (no persistence)!');