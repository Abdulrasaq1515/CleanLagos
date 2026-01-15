import React from 'react';
import { useDispatch } from 'react-redux';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { setMockUser } from '../store/authSlice';

const SimpleLogin = ({ onLogin }) => {
  const dispatch = useDispatch();

  const handleQuickLogin = (role) => {
    const user = {
      id: `admin_${Date.now()}`,
      email: `${role}@cleanlagos.com`,
      fullName: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      role: 'lawma_admin',
    };
    
    dispatch(setMockUser(user));
    console.log('User logged in:', user);
    
    if (onLogin) onLogin(user);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="primary" gutterBottom>
          🌿 CleanLagos Admin
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Waste Management Dashboard
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" paragraph>
            Quick Login (Testing):
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => handleQuickLogin('admin')}
            sx={{ mr: 2, mb: 2 }}
          >
            Login as Admin
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
  
  }
