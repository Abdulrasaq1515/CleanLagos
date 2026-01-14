// apps/admin-dashboard/src/pages/ReportsPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  TextField,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  Checkbox,
  Toolbar,
} from '@mui/material';
import {
  MoreVert,
  CheckCircle,
  Pending,
  Assignment,
  Visibility,
  Delete,
  Refresh,
  Search,
  DoneAll,
  Download,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addNotification } from '@cleanlagos/shared-redux-store';

const ReportsPage = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReports, setSelectedReports] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data
  const [reports, setReports] = useState([
    {
      id: 'R-001',
      citizen: 'John Adebayo',
      location: 'Lagos Island Main Road',
      wasteType: 'Plastic',
      status: 'pending',
      priority: 'High',
      images: 2,
      createdAt: '2024-01-10T10:30:00Z',
      points: 50,
    },
    {
      id: 'R-002',
      citizen: 'Chinwe Nwosu',
      location: 'Victoria Island',
      wasteType: 'General',
      status: 'verified',
      priority: 'Medium',
      images: 1,
      createdAt: '2024-01-10T09:15:00Z',
      points: 30,
    },
    {
      id: 'R-003',
      citizen: 'Emeka Okoro',
      location: 'Ikoyi',
      wasteType: 'Organic',
      status: 'assigned',
      priority: 'Low',
      images: 3,
      createdAt: '2024-01-09T14:20:00Z',
      points: 40,
    },
    {
      id: 'R-004',
      citizen: 'Bola Ahmed',
      location: 'Surulere',
      wasteType: 'Hazardous',
      status: 'completed',
      priority: 'High',
      images: 4,
      createdAt: '2024-01-09T11:45:00Z',
      points: 80,
    },
    {
      id: 'R-005',
      citizen: 'Fatima Yusuf',
      location: 'Apapa',
      wasteType: 'E-Waste',
      status: 'pending',
      priority: 'Medium',
      images: 1,
      createdAt: '2024-01-08T16:10:00Z',
      points: 60,
    },
  ]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredReports.map((n) => n.id);
      setSelectedReports(newSelected);
      return;
    }
    setSelectedReports([]);
  };

  const handleSelectClick = (id) => {
    const selectedIndex = selectedReports.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedReports, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedReports.slice(1));
    } else if (selectedIndex === selectedReports.length - 1) {
      newSelected = newSelected.concat(selectedReports.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedReports.slice(0, selectedIndex),
        selectedReports.slice(selectedIndex + 1)
      );
    }

    setSelectedReports(newSelected);
  };

  const isSelected = (id) => selectedReports.indexOf(id) !== -1;

  const handleMenuOpen = (event, report) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const handleViewReport = () => {
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleVerifyReport = () => {
    setVerifyDialogOpen(true);
    handleMenuClose();
  };

  const handleAssignReport = () => {
    setAssignDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteReport = () => {
    setReports(reports.filter(r => r.id !== selectedReport.id));
    showSnackbar('Report deleted successfully', 'success');
    handleMenuClose();
  };

  const handleBulkVerify = () => {
    const selectedReportObjects = reports.filter(r => selectedReports.includes(r.id) && r.status === 'pending');
    
    if (selectedReportObjects.length === 0) {
      showSnackbar('No pending reports selected', 'warning');
      return;
    }

    setReports(reports.map(r => 
      selectedReports.includes(r.id) && r.status === 'pending'
        ? { ...r, status: 'verified' } 
        : r
    ));
    showSnackbar(`${selectedReportObjects.length} reports verified`, 'success');
    setSelectedReports([]);
  };

  const handleBulkAssign = () => {
    const selectedReportObjects = reports.filter(r => selectedReports.includes(r.id) && r.status === 'verified');
    
    if (selectedReportObjects.length === 0) {
      showSnackbar('No verified reports selected', 'warning');
      return;
    }

    setReports(reports.map(r => 
      selectedReports.includes(r.id) && r.status === 'verified'
        ? { ...r, status: 'assigned' } 
        : r
    ));
    showSnackbar(`${selectedReportObjects.length} reports assigned`, 'success');
    setSelectedReports([]);
  };

  const handleBulkDelete = () => {
    if (selectedReports.length === 0) {
      showSnackbar('No reports selected', 'warning');
      return;
    }

    if (window.confirm(`Delete ${selectedReports.length} reports?`)) {
      setReports(reports.filter(r => !selectedReports.includes(r.id)));
      showSnackbar(`${selectedReports.length} reports deleted`, 'success');
      setSelectedReports([]);
    }
  };

  const handleExportSelected = () => {
    if (selectedReports.length === 0) {
      showSnackbar('No reports selected', 'warning');
      return;
    }

    const selectedData = reports.filter(r => selectedReports.includes(r.id));
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Citizen,Location,Waste Type,Status,Priority,Points,Created At\n"
      + selectedData.map(r => 
        `${r.id},${r.citizen},${r.location},${r.wasteType},${r.status},${r.priority},${r.points},${r.createdAt}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cleanlagos_reports_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSnackbar('Reports exported successfully', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.citizen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const paginatedReports = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'verified': return 'info';
      case 'assigned': return 'primary';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const numSelected = selectedReports.length;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Waste Reports Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => showSnackbar('Reports refreshed', 'info')}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Reports
              </Typography>
              <Typography variant="h4">{reports.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                All time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pending Verification
              </Typography>
              <Typography variant="h4" color="warning.main">
                {reports.filter(r => r.status === 'pending').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Awaiting review
               </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
             <Typography color="text.secondary" gutterBottom>
                Verified
             </Typography>
             <Typography variant="h4" color="info.main">
                {reports.filter(r => r.status === 'verified').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Ready for assignment
                </Typography>
                </CardContent>
                </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                <Card>
                <CardContent>
                <Typography color="text.secondary" gutterBottom>
                Completed Today
                </Typography>
                <Typography variant="h4" color="success.main">
                {reports.filter(r => r.status === 'completed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Cleaned up
                </Typography>
                </CardContent>
                </Card>
                </Grid>
                </Grid>
                {/* Filters */}
  <Paper sx={{ p: 3, mb: 3 }}>
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search reports by ID, citizen, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {['all', 'pending', 'verified', 'assigned', 'completed'].map((status) => (
            <Chip
              key={status}
              label={status.charAt(0).toUpperCase() + status.slice(1)}
              onClick={() => setStatusFilter(status)}
              color={statusFilter === status ? getStatusColor(status) : 'default'}
              variant={statusFilter === status ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Grid>
    </Grid>
  </Paper>
{/* Bulk Actions Toolbar */}
      {numSelected > 0 && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
          <Button
            color="inherit"
            startIcon={<CheckCircle />}
            onClick={handleBulkVerify}
            sx={{ mr: 1 }}
          >
            Verify
          </Button>
          <Button
            color="inherit"
            startIcon={<Assignment />}
            onClick={handleBulkAssign}
            sx={{ mr: 1 }}
          >
            Assign
          </Button>
          <Button
            color="inherit"
            startIcon={<Download />}
            onClick={handleExportSelected}
            sx={{ mr: 1 }}
          >
            Export
          </Button>
          <Button
            color="inherit"
            startIcon={<Delete />}
            onClick={handleBulkDelete}
          >
            Delete
          </Button>
        </Toolbar>
      )}

      {/* Reports Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.50' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={numSelected > 0 && numSelected < filteredReports.length}
                  checked={filteredReports.length > 0 && numSelected === filteredReports.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>Report ID</TableCell>
              <TableCell>Citizen</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Waste Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReports.map((report) => {
              const isItemSelected = isSelected(report.id);
              return (
                <TableRow 
                  key={report.id} 
                  hover
                  onClick={() => handleSelectClick(report.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {report.id}
                    </Typography>
                  </TableCell>
                  <TableCell>{report.citizen}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {report.location}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={report.wasteType} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      color={getStatusColor(report.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={report.priority}
                      color={getPriorityColor(report.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Visibility sx={{ mr: 1, fontSize: 16 }} />
                      {report.images}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" fontWeight="bold">
                      {report.points}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, report);
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredReports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewReport}>
          <Visibility sx={{ mr: 2 }} /> View Details
        </MenuItem>
        <MenuItem 
          onClick={handleVerifyReport}
          disabled={selectedReport?.status !== 'pending'}
        >
          <CheckCircle sx={{ mr: 2 }} /> Verify Report
        </MenuItem>
        <MenuItem 
          onClick={handleAssignReport}
          disabled={selectedReport?.status !== 'verified'}
        >
          <Assignment sx={{ mr: 2 }} /> Assign to PSP
        </MenuItem>
        <MenuItem onClick={handleDeleteReport}>
          <Delete sx={{ mr: 2, color: 'error.main' }} /> Delete Report
        </MenuItem>
      </Menu>

      {/* View Report Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Report Details - {selectedReport?.id}
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Citizen
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedReport.citizen}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedReport.location}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Waste Type
                </Typography>
                <Chip 
                  label={selectedReport.wasteType}
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={selectedReport.status}
                  color={getStatusColor(selectedReport.status)}
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Images
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  {[...Array(selectedReport.images)].map((_, i) => (
                    <Paper
                      key={i}
                      sx={{
                        width: 100,
                        height: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.100',
                      }}
                    >
                      <Typography color="text.secondary">
                        Image {i + 1}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button variant="contained">Take Action</Button>
        </DialogActions>
      </Dialog>

      {/* Verify Report Dialog */}
      <Dialog 
        open={verifyDialogOpen} 
        onClose={() => setVerifyDialogOpen(false)}
      >
        <DialogTitle>Verify Report</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to verify report {selectedReport?.id}?
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Verified reports become available for assignment to PSP workers.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedReport) {
                setReports(reports.map(r => 
                  r.id === selectedReport.id 
                    ? { ...r, status: 'verified' } 
                    : r
                ));
                showSnackbar('Report verified successfully', 'success');
                setVerifyDialogOpen(false);
              }
            }}
          >
            Verify Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Report Dialog */}
      <Dialog 
        open={assignDialogOpen} 
        onClose={() => setAssignDialogOpen(false)}
      >
        <DialogTitle>Assign to PSP Worker</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Assign report {selectedReport?.id} to:
          </Typography>
          <TextField
            select
            fullWidth
            label="Select PSP Worker"
            variant="outlined"
            sx={{ mt: 2 }}
            defaultValue=""
          >
            <MenuItem value="">-- Select PSP Worker --</MenuItem>
            <MenuItem value="psp1">Clean Team Lagos (Rating: 4.8)</MenuItem>
            <MenuItem value="psp2">Eco Warriors (Rating: 4.5)</MenuItem>
            <MenuItem value="psp3">Green Cleaners (Rating: 4.7)</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedReport) {
                setReports(reports.map(r => 
                  r.id === selectedReport.id 
                    ? { ...r, status: 'assigned' } 
                    : r
                ));
                showSnackbar('Report assigned successfully', 'success');
                setAssignDialogOpen(false);
              }
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReportsPage;