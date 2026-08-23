import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
} from '@mui/material';
import { TrendingUp, AccountBalance, History, Download, DoneAll } from '@mui/icons-material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * EarningsDashboard Component
 * Displays earnings, payment history, and analytics for PSP/Recycler
 */
export default function EarningsDashboard() {
  const [userType] = useState('recycler'); // 'psp' or 'recycler'
  const [totalEarnings, setTotalEarnings] = useState(125000);
  const [pendingPayment, setPendingPayment] = useState(24500);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Bank Account', details: 'Access Bank ***2021', primary: true, verified: true },
    { id: 2, type: 'Mobile Money', details: 'MTN ****5678', primary: false, verified: true },
  ]);

  const earningsData = [
    { month: 'Jun', psp: 15000, recycler: 22000, total: 37000 },
    { month: 'Jul', psp: 18000, recycler: 25000, total: 43000 },
    { month: 'Aug', psp: 21000, recycler: 28000, total: 49000 },
    { month: 'Sep', psp: 19000, recycler: 26000, total: 45000 },
    { month: 'Oct', psp: 23000, recycler: 30000, total: 53000 },
    { month: 'Nov', psp: 25000, recycler: 32000, total: 57000 },
    { month: 'Dec', psp: 28000, recycler: 35000, total: 63000 },
    { month: 'Jan', psp: 22000, recycler: 28000, total: 50000 },
  ];

  const dailyEarningsData = [
    { date: 'Jan 1', earnings: 2000 },
    { date: 'Jan 2', earnings: 2500 },
    { date: 'Jan 3', earnings: 1800 },
    { date: 'Jan 4', earnings: 3200 },
    { date: 'Jan 5', earnings: 2800 },
    { date: 'Jan 6', earnings: 3500 },
    { date: 'Jan 7', earnings: 2200 },
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'Waste Collection',
      description: 'Collected 150kg plastic waste',
      amount: 5000,
      date: '2024-01-07',
      status: 'completed',
    },
    {
      id: 2,
      type: 'Waste Processing',
      description: 'Processed 200kg mixed waste',
      amount: 8000,
      date: '2024-01-06',
      status: 'completed',
    },
    {
      id: 3,
      type: 'Site Cleanup',
      description: 'PSP site cleanup task',
      amount: 12000,
      date: '2024-01-05',
      status: 'completed',
    },
    {
      id: 4,
      type: 'Waste Collection',
      description: 'Collected 100kg organic waste',
      amount: 3500,
      date: '2024-01-04',
      status: 'pending',
    },
  ];

  const paymentHistory = [
    {
      id: 1,
      date: '2024-01-03',
      amount: 45000,
      method: 'Bank Account',
      status: 'completed',
      reference: 'CLG-2024-001',
    },
    {
      id: 2,
      date: '2023-12-28',
      amount: 38000,
      method: 'Mobile Money',
      status: 'completed',
      reference: 'CLG-2023-048',
    },
    {
      id: 3,
      date: '2023-12-20',
      amount: 52000,
      method: 'Bank Account',
      status: 'completed',
      reference: 'CLG-2023-047',
    },
  ];

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseInt(withdrawAmount) > pendingPayment) {
      alert('Invalid amount');
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`✅ Withdrawal request of ₦${parseInt(withdrawAmount).toLocaleString()} submitted!`);
    setWithdrawDialogOpen(false);
    setWithdrawAmount('');
    setPendingPayment(pendingPayment - parseInt(withdrawAmount));
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <TrendingUp sx={{ mr: 1, color: '#667eea' }} />
          Earnings Dashboard
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {userType === 'recycler'
            ? "Track your waste collection & processing earnings"
            : 'Track your service point earnings'}
        </Typography>
      </Box>

      {/* Alert */}
      {pendingPayment > 0 && (
        <Alert severity="success" sx={{ mb: 3 }}>
          💰 You have ₦{pendingPayment.toLocaleString()} pending withdrawal. Request your payout now!
        </Alert>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Earnings */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>Total Earnings</Typography>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  ₦{totalEarnings.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  All-time earnings
                </Typography>
              </Box>
              <TrendingUp sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '3rem' }} />
            </Box>
          </Paper>
        </Grid>

        {/* Pending Payout */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>Pending Payout</Typography>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  ₦{pendingPayment.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Ready to withdraw
                </Typography>
              </Box>
              <AccountBalance sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '3rem' }} />
            </Box>
          </Paper>
        </Grid>

        {/* This Month */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, bgcolor: '#fff' }}>
            <Box>
              <Typography color="textSecondary" sx={{ mb: 1, fontSize: '0.9rem' }}>
                This Month
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                ₦50,000
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  ↑ 12% from last month
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Target */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, bgcolor: '#fff' }}>
            <Box>
              <Typography color="textSecondary" sx={{ mb: 1, fontSize: '0.9rem' }}>
                Monthly Goal
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                80%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={80}
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption" color="textSecondary">
                ₦80,000 target • ₦64,000 earned
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Withdraw Button */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={<Download />}
          onClick={() => setWithdrawDialogOpen(true)}
          disabled={pendingPayment === 0}
        >
          Withdraw Funds
        </Button>
      </Box>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Monthly Earnings Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              📊 Monthly Earnings Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={value => `₦${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey={userType === 'recycler' ? 'recycler' : 'psp'} fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Daily Earnings */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              📈 This Week
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyEarningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '0.75rem' }} />
                <YAxis />
                <Tooltip formatter={value => `₦${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="earnings" stroke="#667eea" strokeWidth={2} dot={{ fill: '#667eea' }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions & Payment History */}
      <Grid container spacing={3}>
        {/* Recent Earnings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
              <DoneAll sx={{ mr: 1 }} />
              Recent Earnings
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell align="right"><strong>Amount</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTransactions.map(tx => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {tx.type}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {tx.date}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                          ₦{tx.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tx.status}
                          size="small"
                          color={tx.status === 'completed' ? 'success' : 'warning'}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Payment History */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
              <History sx={{ mr: 1 }} />
              Payment History
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell align="right"><strong>Amount</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentHistory.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {payment.date}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {payment.method}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ₦{payment.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onClose={() => setWithdrawDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Withdraw Funds</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Available Balance: <strong>₦{pendingPayment.toLocaleString()}</strong>
          </Alert>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Withdrawal Amount (₦)
            </Typography>
            <input
              type="number"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
              Minimum: ₦1,000 | Maximum: ₦{pendingPayment.toLocaleString()}
            </Typography>
          </Box>

          <Paper sx={{ p: 2, bgcolor: '#f5f5f5', mb: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Withdraw to:
            </Typography>
            {paymentMethods
              .filter(m => m.verified)
              .map(method => (
                <Box
                  key={method.id}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    bgcolor: '#fff',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {method.type}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {method.details}
                    {method.primary && ' (Primary)'}
                  </Typography>
                </Box>
              ))}
          </Paper>

          <Typography variant="caption" color="textSecondary">
            ⏱️ Withdrawals typically process within 24-48 hours. You'll receive a confirmation via email and SMS.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleWithdraw}
            variant="contained"
            disabled={!withdrawAmount || parseInt(withdrawAmount) > pendingPayment}
          >
            Confirm Withdrawal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
