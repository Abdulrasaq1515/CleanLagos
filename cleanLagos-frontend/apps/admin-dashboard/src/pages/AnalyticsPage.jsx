import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Download,
  FilterAlt,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Waste type distribution data
  const wasteTypeData = [
    { name: 'Plastic', value: 35, color: '#2196F3' },
    { name: 'Organic', value: 25, color: '#4CAF50' },
    { name: 'General', value: 20, color: '#FF9800' },
    { name: 'Hazardous', value: 12, color: '#F44336' },
    { name: 'E-Waste', value: 8, color: '#9C27B0' },
  ];

  // Reports over time data
  const reportsData = {
    week: [
      { day: 'Mon', reports: 42, completed: 35 },
      { day: 'Tue', reports: 38, completed: 32 },
      { day: 'Wed', reports: 56, completed: 48 },
      { day: 'Thu', reports: 47, completed: 40 },
      { day: 'Fri', reports: 52, completed: 45 },
      { day: 'Sat', reports: 34, completed: 28 },
      { day: 'Sun', reports: 28, completed: 22 },
    ],
    month: [
      { week: 'Week 1', reports: 180, completed: 150 },
      { week: 'Week 2', reports: 220, completed: 190 },
      { week: 'Week 3', reports: 240, completed: 210 },
      { week: 'Week 4', reports: 210, completed: 180 },
    ],
    quarter: [
      { month: 'Jan', reports: 850, completed: 720 },
      { month: 'Feb', reports: 920, completed: 800 },
      { month: 'Mar', reports: 980, completed: 850 },
    ],
  };

  // PSP performance data
  const pspPerformanceData = [
    { name: 'Clean Team', tasks: 145, rating: 4.8, efficiency: 95 },
    { name: 'Eco Warriors', tasks: 120, rating: 4.5, efficiency: 88 },
    { name: 'Green Cleaners', tasks: 98, rating: 4.7, efficiency: 92 },
    { name: 'Waste Masters', tasks: 85, rating: 4.3, efficiency: 82 },
    { name: 'Urban Clean', tasks: 76, rating: 4.2, efficiency: 78 },
  ];

  // Location hotspots data
  const locationData = [
    { location: 'Lagos Island', reports: 245, severity: 'High' },
    { location: 'Victoria Island', reports: 189, severity: 'High' },
    { location: 'Surulere', reports: 156, severity: 'Medium' },
    { location: 'Ikoyi', reports: 132, severity: 'Medium' },
    { location: 'Apapa', reports: 98, severity: 'Low' },
    { location: 'Yaba', reports: 87, severity: 'Low' },
  ];

  const handleExport = () => {
    // Export functionality would be implemented here
    alert('Export functionality coming soon!');
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Analytics Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<FilterAlt />}
          >
            Filters
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Reports
              </Typography>
              <Typography variant="h4">1,248</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  ↑ 12% from last {timeRange}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Completion Rate
              </Typography>
              <Typography variant="h4">94%</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  ↑ 3% from last {timeRange}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Avg. Response Time
              </Typography>
              <Typography variant="h4">2.4h</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingDown sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  ↓ 0.5h from last {timeRange}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Citizen Satisfaction
              </Typography>
              <Typography variant="h4">4.7/5</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  ↑ 0.2 from last {timeRange}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Reports Over Time */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Reports Over Time
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={reportsData[timeRange]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeRange === 'week' ? 'day' : timeRange === 'month' ? 'week' : 'month'} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="reports" 
                  stroke="#2E7D32" 
                  strokeWidth={2}
                  name="Reports Created"
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#2196F3" 
                  strokeWidth={2}
                  name="Reports Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Waste Type Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Waste Type Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={wasteTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {wasteTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* PSP Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              PSP Worker Performance
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={pspPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="tasks" 
                  fill="#2E7D32" 
                  name="Tasks Completed"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="efficiency" 
                  fill="#2196F3" 
                  name="Efficiency %"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Location Hotspots */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Location Hotspots
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="reports" 
                  fill="#FF9800" 
                  name="Reports Count"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Data Tables */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Performing PSP Workers
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>PSP Name</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Tasks</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Rating</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {pspPerformanceData.map((psp) => (
                    <tr key={psp.name} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{psp.name}</td>
                      <td style={{ padding: '12px' }}>{psp.tasks}</td>
                      <td style={{ padding: '12px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          ⭐ {psp.rating}
                        </Box>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: '100%',
                              bgcolor: '#e0e0e0',
                              borderRadius: 1,
                              mr: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: `${psp.efficiency}%`,
                                height: 8,
                                bgcolor: psp.efficiency > 90 ? '#4CAF50' : 
                                        psp.efficiency > 80 ? '#FF9800' : '#F44336',
                                borderRadius: 1,
                              }}
                            />
                          </Box>
                          {psp.efficiency}%
                        </Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Waste Hotspots
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Location</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Reports</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Severity</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {locationData.map((location) => (
                    <tr key={location.location} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{location.location}</td>
                      <td style={{ padding: '12px' }}>{location.reports}</td>
                      <td style={{ padding: '12px' }}>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: location.severity === 'High' ? '#FFEBEE' : 
                                    location.severity === 'Medium' ? '#FFF3E0' : '#E8F5E9',
                            color: location.severity === 'High' ? '#D32F2F' : 
                              location.severity === 'Medium' ? '#F57C00' : '#2E7D32',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {location.severity}
                        </Box>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Button size="small" variant="outlined">
                          Deploy PSP
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};




export default AnalyticsPage;