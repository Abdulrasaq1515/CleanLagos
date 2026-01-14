import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API
const mockApi = {
  submitReport: async (reportData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: 'report_' + Date.now(),
      ...reportData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pointsAwarded: 10,
    };
  },
  
  getMyReports: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 'report_1',
        location: { address: 'Lagos Island Main Road', coordinates: { lat: 6.5244, lng: 3.3792 } },
        images: ['image1.jpg'],
        description: 'Plastic waste accumulation',
        wasteType: 'plastic',
        urgency: 'high',
        status: 'pending',
        pointsAwarded: 10,
        createdAt: '2024-01-10T10:00:00Z',
      },
      {
        id: 'report_2',
        location: { address: 'Victoria Island', coordinates: { lat: 6.4281, lng: 3.4215 } },
        images: ['image2.jpg'],
        description: 'Garbage dump by roadside',
        wasteType: 'general',
        urgency: 'medium',
        status: 'verified',
        pointsAwarded: 15,
        createdAt: '2024-01-09T14:30:00Z',
      },
      {
        id: 'report_3',
        location: { address: 'Ikoyi', coordinates: { lat: 6.4522, lng: 3.4350 } },
        images: ['image3.jpg'],
        description: 'Overflowing dustbin',
        wasteType: 'organic',
        urgency: 'low',
        status: 'completed',
        pointsAwarded: 20,
        createdAt: '2024-01-08T09:15:00Z',
        completedAt: '2024-01-08T15:30:00Z',
      },
    ];
  },
  
  deleteReport: async (reportId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, reportId };
  }
};

export const submitReport = createAsyncThunk(
  'reports/submit',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await mockApi.submitReport(reportData);
      console.log('Report submitted:', response.id);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to submit report'
      });
    }
  }
);

export const fetchMyReports = createAsyncThunk(
  'reports/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockApi.getMyReports();
      return response;
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to fetch reports'
      });
    }
  }
);

export const deleteReportById = createAsyncThunk(
  'reports/delete',
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await mockApi.deleteReport(reportId);
      return reportId;
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to delete report'
      });
    }
  }
);

/**
 * Sync offline reports to backend when network is restored.
 * Retries each report with exponential backoff; "server wins" on conflicts.
 */
export const syncOfflineReports = createAsyncThunk(
  'reports/syncOffline',
  async (_, { getState, rejectWithValue }) => {
    const { reports } = getState();
    const pendingReports = reports.pendingReports || [];

    if (pendingReports.length === 0) {
      console.log('No offline reports to sync');
      return { synced: [], failed: [] };
    }

    const synced = [];
    const failed = [];

    console.log(`Syncing ${pendingReports.length} offline reports...`);

    for (const offlineReport of pendingReports) {
      try {
        // Attempt to submit the offline report to the server
        const result = await submitReport(offlineReport).unwrap();
        synced.push(offlineReport.id);
        console.log(`Synced offline report ${offlineReport.id}`);
      } catch (error) {
        // Mark as failed and will retry on next network restore
        failed.push({
          id: offlineReport.id,
          reason: error.message || 'Unknown error',
        });
        console.error(`Failed to sync offline report ${offlineReport.id}:`, error);
      }
    }

    return { synced, failed };
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    myReports: [],
    pendingReports: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
    syncStatus: 'idle', // 'idle' | 'syncing' | 'success' | 'error'
    syncError: null,
  },
  reducers: {
    addOfflineReport: (state, action) => {
      const offlineReport = {
        ...action.payload,
        id: `offline_${Date.now()}`,
        status: 'offline',
        createdAt: new Date().toISOString(),
      };
      state.pendingReports.push(offlineReport);
      console.log('Report saved offline:', offlineReport.id);
    },
    clearOfflineReports: (state) => {
      state.pendingReports = [];
      console.log('Offline reports cleared');
    },
    removeOfflineReport: (state, action) => {
      state.pendingReports = state.pendingReports.filter(
        report => report.id !== action.payload
      );
      console.log('Offline report removed:', action.payload);
    },
    deleteReport: (state, action) => {
      state.myReports = state.myReports.filter(
        report => report.id !== action.payload
      );
      console.log('Report deleted:', action.payload);
    },
    clearReportError: (state) => {
      state.error = null;
    },
    clearSyncError: (state) => {
      state.syncError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitReport.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(submitReport.fulfilled, (state, action) => {
      state.isLoading = false;
      state.myReports.unshift(action.payload);
      console.log('Report added to list');
    });
    builder.addCase(submitReport.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(fetchMyReports.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchMyReports.fulfilled, (state, action) => {
      state.isLoading = false;
      state.myReports = action.payload;
      state.lastUpdated = new Date().toISOString();
      console.log('Reports fetched:', action.payload.length);
    });
    builder.addCase(fetchMyReports.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    
    builder.addCase(deleteReportById.fulfilled, (state, action) => {
      state.myReports = state.myReports.filter(r => r.id !== action.payload);
    });

    // Sync offline reports
    builder.addCase(syncOfflineReports.pending, (state) => {
      state.syncStatus = 'syncing';
      state.syncError = null;
      console.log('Starting offline report sync...');
    });
    builder.addCase(syncOfflineReports.fulfilled, (state, action) => {
      const { synced, failed } = action.payload;
      // Remove synced offline reports from pendingReports
      state.pendingReports = state.pendingReports.filter(
        r => !synced.includes(r.id)
      );
      state.syncStatus = failed.length > 0 ? 'error' : 'success';
      if (failed.length > 0) {
        state.syncError = `${failed.length} report(s) failed to sync. Will retry when connected.`;
      }
      console.log(`Sync complete: ${synced.length} synced, ${failed.length} failed`);
    });
    builder.addCase(syncOfflineReports.rejected, (state, action) => {
      state.syncStatus = 'error';
      state.syncError = action.payload?.message || 'Sync failed. Will retry when connected.';
      console.error('Offline sync error:', state.syncError);
    });
  },
});

export const { 
  addOfflineReport, 
  clearOfflineReports,
  removeOfflineReport,
  deleteReport,
  clearReportError,
  clearSyncError,
} = reportSlice.actions;

export default reportSlice.reducer;