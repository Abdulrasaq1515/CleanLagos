import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LocationOn, TrendingUp, Warning } from '@mui/icons-material';

/**
 * HeatmapPage Component
 * Displays waste hotspots and high-risk areas on a map
 * Currently uses mock data; ready for real backend integration with map library
 */
export default function HeatmapPage() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // Mock heatmap data - replace with real API call when backend ready
  const mockHeatmapData = [
    { lat: 6.5244, lng: 3.3792, intensity: 95, address: 'Lagos Island', reports: 450, lastReport: '2 mins ago' },
    { lat: 6.4281, lng: 3.4215, intensity: 85, address: 'Victoria Island', reports: 320, lastReport: '15 mins ago' },
    { lat: 6.4522, lng: 3.4350, intensity: 72, address: 'Ikoyi', reports: 280, lastReport: '1 hour ago' },
    { lat: 6.4969, lng: 3.3608, intensity: 68, address: 'Lekki Phase 1', reports: 250, lastReport: '3 hours ago' },
    { lat: 6.5521, lng: 3.3473, intensity: 55, address: 'Yaba', reports: 180, lastReport: '5 hours ago' },
    { lat: 6.6521, lng: 3.3973, intensity: 42, address: 'Bariga', reports: 120, lastReport: '1 day ago' },
  ];

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with real API call when backend ready
      // const response = await dispatch(getHeatmapData());
      // setHeatmapData(response.payload);
      
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      setHeatmapData(mockHeatmapData);
      setError(null);
    } catch (err) {
      console.error('Error fetching heatmap data:', err);
      setError('Failed to load heatmap data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getIntensityColor = (intensity) => {
    if (intensity >= 80) return '#d32f2f'; // Red - Critical
    if (intensity >= 60) return '#f57c00'; // Orange - High
    if (intensity >= 40) return '#fbc02d'; // Yellow - Medium
    return '#388e3c'; // Green - Low
  };

  const getIntensityLabel = (intensity) => {
    if (intensity >= 80) return 'Critical';
    if (intensity >= 60) return 'High';
    if (intensity >= 40) return 'Medium';
    return 'Low';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Prepare data for chart visualization
  const chartData = heatmapData.sort((a, b) => b.intensity - a.intensity);

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <LocationOn sx={{ mr: 1 }} />
          Waste Hotspot Map
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
          Real-time visualization of high-risk waste accumulation areas
        </Typography>
      </Box>

      {/* Key Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(255,255,255,0.95)' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Critical Hotspots
              </Typography>
              <Typography variant="h6" sx={{ color: '#d32f2f' }}>
                {heatmapData.filter(h => h.intensity >= 80).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(255,255,255,0.95)' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Hotspots
              </Typography>
              <Typography variant="h6" sx={{ color: '#667eea' }}>
                {heatmapData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(255,255,255,0.95)' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Reports
              </Typography>
              <Typography variant="h6" sx={{ color: '#764ba2' }}>
                {heatmapData.reduce((sum, h) => sum + h.reports, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(255,255,255,0.95)' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Intensity
              </Typography>
              <Typography variant="h6" sx={{ color: '#f57c00' }}>
                {(heatmapData.reduce((sum, h) => sum + h.intensity, 0) / heatmapData.length).toFixed(0)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Intensity Bar Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
          Waste Intensity by Location
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="address" angle={-45} textAnchor="end" height={100} />
            <YAxis domain={[0, 100]} label={{ value: 'Intensity %', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Intensity']}
              labelFormatter={(label) => `Location: ${label}`}
            />
            <Legend />
            <Bar
              dataKey="intensity"
              fill="#667eea"
              name="Waste Intensity"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Hotspots List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          High-Risk Areas (Priority Response)
        </Typography>
        <Grid container spacing={2}>
          {chartData.map((hotspot, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderLeft: `4px solid ${getIntensityColor(hotspot.intensity)}`,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-4px)',
                  },
                  background: selectedHotspot?.address === hotspot.address ? 'rgba(102, 126, 234, 0.1)' : '#fff',
                }}
                onClick={() => setSelectedHotspot(hotspot)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {hotspot.address}
                    </Typography>
                    <Chip
                      label={getIntensityLabel(hotspot.intensity)}
                      size="small"
                      sx={{
                        backgroundColor: getIntensityColor(hotspot.intensity),
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Intensity:</strong> {hotspot.intensity}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Reports:</strong> {hotspot.reports.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Coordinates:</strong> {hotspot.lat.toFixed(4)}, {hotspot.lng.toFixed(4)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Last Report:</strong> {hotspot.lastReport}
                    </Typography>
                  </Box>

                  {hotspot.intensity >= 80 && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      <Warning sx={{ mr: 1 }} />
                      Critical - Immediate response needed
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Note */}
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mt: 3, textAlign: 'center' }}>
        💡 Tip: Click on a hotspot for more details. Data updates every 5 minutes.
        <br />
        🗺️ Map visualization coming soon - integrate with Google Maps or Mapbox for spatial view.
      </Typography>
    </Box>
  );
}
