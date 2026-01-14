// apps/admin-dashboard/src/App.jsx
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@cleanlagos/shared-redux-store';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';

import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HeatmapPage from './pages/HeatmapPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
    },
    secondary: {
      main: '#2196F3',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
    <Typography sx={{ ml: 2 }}>Loading CleanLagos...</Typography>
  </Box>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 CleanLagos App Error:', error);
    console.error('🚨 Error Info:', errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6">Something went wrong with CleanLagos Admin</Typography>
          </Alert>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Error: {this.state.error && this.state.error.toString()}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

function App() {
  console.log('🌿 CleanLagos App starting...');
  console.log('📦 Store:', store);
  console.log('💾 Persistor:', persistor);
  
  try {
    return (
      <ErrorBoundary>
        <Provider store={store}>
          <PersistGate 
            loading={<LoadingFallback />} 
            persistor={persistor}
            onBeforeLift={() => {
              console.log('🔄 PersistGate: Before lift');
            }}
          >
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Router>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['lawma_admin', 'system_admin']}>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute allowedRoles={['lawma_admin', 'system_admin']}>
                        <ReportsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute allowedRoles={['lawma_admin', 'system_admin']}>
                        <AnalyticsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/heatmap"
                    element={
                      <ProtectedRoute allowedRoles={['lawma_admin', 'system_admin']}>
                        <HeatmapPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
              </Router>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('🚨 CleanLagos App failed to render:', error);
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error">
          <Typography variant="h6">Failed to load CleanLagos Admin</Typography>
          <Typography variant="body2">Check console for details: {error.message}</Typography>
        </Alert>
      </Box>
    );
  }
}

export default App;