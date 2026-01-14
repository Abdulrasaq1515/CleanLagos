// apps/admin-dashboard/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { loginUser, setMockUser } from '@cleanlagos/shared-redux-store';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  const [credentials, setCredentials] = useState({
    email: 'admin@cleanlagos.com',
    password: 'password123',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await dispatch(loginUser(credentials));
    
    if (loginUser.fulfilled.match(result)) {
      // Check if user is admin
      if (result.payload.user.role === 'lawma_admin' || result.payload.user.role === 'system_admin') {
        navigate('/dashboard');
      } else {
        // For testing, set mock admin user
        dispatch(setMockUser({
          ...result.payload.user,
          role: 'lawma_admin',
        }));
        navigate('/dashboard');
      }
    }
  };

  const handleQuickLogin = (role) => {
    dispatch(setMockUser({
      id: `admin_${Date.now()}`,
      email: `${role}@cleanlagos.com`,
      fullName: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      role: 'lawma_admin',
    }));
    navigate('/dashboard');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" color="primary" gutterBottom>
            🌿 CleanLagos Admin
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            Waste Management Dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message || 'Login failed'}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              autoComplete="email"
              autoFocus
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              For testing purposes:
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleQuickLogin('admin')}
                sx={{ flex: 1 }}
              >
                Admin
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleQuickLogin('supervisor')}
                sx={{ flex: 1 }}
              >
                Supervisor
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleQuickLogin('auditor')}
                sx={{ flex: 1 }}
              >
                Auditor
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;