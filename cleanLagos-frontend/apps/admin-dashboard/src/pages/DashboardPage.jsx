// apps/admin-dashboard/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Dashboard as DashboardIcon,
  Report,
  Analytics,
  People,
  LocationOn,
  CheckCircle,
  Pending,
  Warning,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { logout, addNotification } from '@cleanlagos/shared-redux-store';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const statsData = [
    { name: 'Jan', reports: 400, completed: 240 },
    { name: 'Feb', reports: 300, completed: 139 },
    { name: 'Mar', reports: 200, completed: 980 },
    { name: 'Apr', reports: 278, completed: 390 },
    { name: 'May', reports: 189, completed: 480 },
    { name: 'Jun', reports: 239, completed: 380 },
    { name: 'Jul', reports: 349, completed: 430 },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(
      addNotification({
        type: 'info',
        message: 'Logged out successfully',
      })
    );
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Paper
        sx={{
          width: sidebarOpen ? 280 : 70,
          height: '100vh',
          position: 'fixed',
          zIndex: 1200,
          transition: 'width 0.3s',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        elevation={3}
      >
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          {sidebarOpen ? (
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              CleanLagos Admin
            </Typography>
          ) : (
            <IconButton onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        <Box sx={{ flex: 1, p: 2 }}>
          {[
            { icon: <DashboardIcon />, text: 'Dashboard', path: '/dashboard', active: true },
            { icon: <Report />, text: 'Reports', path: '/reports' },
            { icon: <Analytics />, text: 'Analytics', path: '/analytics' },
            { icon: <People />, text: 'PSP Workers', path: '#' },
            { icon: <People />, text: 'Citizens', path: '#' },
            { icon: <LocationOn />, text: 'Heatmap', path: '/heatmap' },
          ].map((item) => (
            <Box
              key={item.text}
              onClick={() => {
                if (item.path && item.path !== '#') {
                  navigate(item.path);
                }
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderRadius: 2,
                mb: 1,
                bgcolor: item.active ? 'primary.main' : 'transparent',
                color: item.active ? 'white' : 'text.primary',
                cursor: item.path && item.path !== '#' ? 'pointer' : 'default',
                '&:hover': {
                  bgcolor: item.path && item.path !== '#' ? 
                    (item.active ? 'primary.dark' : 'action.hover') : 
                    'transparent',
                },
              }}
            >
              {item.icon}
              {sidebarOpen && (
                <Typography sx={{ ml: 2, fontWeight: item.active ? 'bold' : 'normal' }}>
                  {item.text}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, ml: sidebarOpen ? '280px' : '70px', transition: 'margin-left 0.3s' }}>
        {/* Top Bar */}
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>

            <IconButton color="inherit">
              <Notifications />
            </IconButton>

            <IconButton onClick={handleMenuOpen} color="inherit">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {user?.fullName?.charAt(0) || 'A'}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <MenuItem>
                <AccountCircle sx={{ mr: 2 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography color="error">Logout</Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {/* Welcome Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Welcome back, {user?.fullName || 'Admin'}! 👋
              </Typography>
              <Typography color="text.secondary">
                Here's what's happening with waste management in Lagos today.
              </Typography>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography color="text.secondary" gutterBottom>
                      Total Reports
                    </Typography>
                    <Chip label="Today" size="small" />
                  </Box>
                  <Typography variant="h4">1,248</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="body2">↑ 12% from yesterday</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography color="text.secondary" gutterBottom>
                      Pending Verification
                    </Typography>
                    <Pending sx={{ color: 'warning.main' }} />
                  </Box>
                  <Typography variant="h4">42</Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress variant="determinate" value={60} sx={{ height: 8, borderRadius: 4 }} />
                    <Typography variant="body2" sx={{ mt: 1 }}>60% verified today</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography color="text.secondary" gutterBottom>
                      Active PSP Workers
                    </Typography>
                    <People sx={{ color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h4">156</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2" color="success.main">↑ 8 new today</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography color="text.secondary" gutterBottom>
                      Completion Rate
                    </Typography>
                    <CheckCircle sx={{ color: 'success.main' }} />
                  </Box>
                  <Typography variant="h4">94%</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Warning sx={{ color: 'warning.main', mr: 1 }} />
                    <Typography variant="body2">6% pending completion</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Reports Overview
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={statsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="reports" stroke="#2E7D32" strokeWidth={2} />
                        <Line type="monotone" dataKey="completed" stroke="#2196F3" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Waste Types
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {[
                      { type: 'Plastic', percentage: 35, color: '#2196F3' },
                      { type: 'Organic', percentage: 25, color: '#4CAF50' },
                      { type: 'General', percentage: 20, color: '#FF9800' },
                      { type: 'Hazardous', percentage: 12, color: '#F44336' },
                      { type: 'E-Waste', percentage: 8, color: '#9C27B0' },
                    ].map((item) => (
                      <Box key={item.type} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{item.type}</Typography>
                          <Typography variant="body2">{item.percentage}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={item.percentage}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: `${item.color}20`,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: item.color,
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Activity */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                {[
                  { time: '10:30 AM', action: 'PSP Worker "Clean Team" completed task #T-1234', user: 'James Okoro' },
                  { time: '09:45 AM', action: 'New waste report from Victoria Island', user: 'Chinwe Nwosu' },
                  { time: '09:15 AM', action: 'Citizen "Adebayo" redeemed 500 points', user: 'System' },
                  { time: '08:30 AM', action: 'PSP Worker assigned to report #R-5678', user: 'Admin' },
                  { time: 'Yesterday', action: 'Monthly payments processed for 156 PSP workers', user: 'System' },
                ].map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 2,
                      borderBottom: index < 4 ? 1 : 0,
                      borderColor: 'divider',
                    }}
                  >
                    <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}>
                      {activity.user.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1">{activity.action}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.time} • By {activity.user}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardPage;