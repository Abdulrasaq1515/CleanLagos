import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportsAPI } from '../services/api';

// Async thunks
export const createReport = createAsyncThunk(
  'reports/create',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.create(reportData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchReports = createAsyncThunk(
  'reports/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const assignReport = createAsyncThunk(
  'reports/assign',
  async ({ reportId, workerId, deadline }, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.assign(reportId, { workerId, deadline });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateReportStatus = createAsyncThunk(
  'reports/updateStatus',
  async ({ reportId, status, proof }, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.updateStatus(reportId, { status, proof });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  reports: [],
  currentReport: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    status: null,
    category: null,
  },
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { status: null, category: null };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create report
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.unshift(action.payload.data);
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch reports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Assign report
      .addCase(assignReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignReport.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reports.findIndex(r => r._id === action.payload.data._id);
        if (index !== -1) {
          state.reports[index] = action.payload.data;
        }
      })
      .addCase(assignReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update status
      .addCase(updateReportStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reports.findIndex(r => r._id === action.payload.data._id);
        if (index !== -1) {
          state.reports[index] = action.payload.data;
        }
      })
      .addCase(updateReportStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilters, clearFilters } = reportSlice.actions;
export default reportSlice.reducer;
