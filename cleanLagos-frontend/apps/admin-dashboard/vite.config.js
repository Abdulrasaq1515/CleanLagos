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
  resolve: {
    alias: {
      // Use absolute path resolution so Vite reliably finds the shared package
      '@cleanlagos/shared-redux-store': path.resolve(__dirname, '../../packages/shared/redux-store/src'),
    },
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'mui': ['@mui/material', '@mui/icons-material'],
          'charts': ['recharts'],
          'redux': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'router': ['react-router-dom'],
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  // Optimize dev server
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material', 
      'recharts',
      'react-router-dom',
      '@reduxjs/toolkit'
    ]
  }
});