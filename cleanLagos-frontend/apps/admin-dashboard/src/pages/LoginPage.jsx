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
import { loginUser } from '@cleanlagos/shared-redux-store';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [credentials, setCredentials] = useState({
    phone: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await dispatch(loginUser(credentials));
    
    if (loginUser.fulfilled.match(result)) {
      const userRole = result.payload.user.role;
      
      // Only allow admin roles to access dashboard
      if (userRole === 'lawma_admin' || userRole === 'system_admin') {
        navigate('/dashboard');
      } else {
        alert('Access denied. Admin privileges required.');
      }
    }
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
              label="Phone Number"
              type="tel"
              value={credentials.phone}
              onChange={(e) => setCredentials({ ...credentials, phone: e.target.value })}
              placeholder="+234XXXXXXXXXX"
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
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Typography
                  component="span"
                  sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => navigate('/register')}
                >
                  Register Here
                </Typography>
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              Admin access only
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
