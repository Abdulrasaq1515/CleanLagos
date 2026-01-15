import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  server: {
    port: 3000,
  },
  // Optimize dev server
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material', 
      'recharts',
      'react-router-dom',
      '@reduxjs/toolkit',
      '@popperjs/core'
    ],
    exclude: ['@react-native-async-storage/async-storage']
  },
  resolve: {
    alias: {
      // Use absolute path resolution so Vite reliably finds the shared package
      '@cleanlagos/shared-redux-store': path.resolve(__dirname, '../../packages/shared/redux-store/src'),
      // Mock React Native packages for web
      '@react-native-async-storage/async-storage': path.resolve(__dirname, './src/mocks/asyncStorage.js'),
    },
  },
});