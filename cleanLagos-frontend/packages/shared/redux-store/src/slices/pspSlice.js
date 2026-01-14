import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API functions
const mockApi = {
  getMyTasks: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 'task_1',
        reportId: 'report_1',
        status: 'assigned',
        priority: 'high',
        location: {
          address: 'Lagos Island Main Road',
          coordinates: { lat: 6.5244, lng: 3.3792 }
        },
        wasteType: 'plastic',
        description: 'Plastic waste accumulation by roadside',
        assignedAt: '2024-01-10T09:00:00Z',
        deadline: '2024-01-10T18:00:00Z',
        estimatedTime: 120,
        pointsValue: 150,
        reportImages: [],
        citizen: {
          id: 'citizen_1',
          name: 'John Doe',
          phone: '080***4567'
        }
      },
      {
        id: 'task_2',
        reportId: 'report_2',
        status: 'accepted',
        priority: 'medium',
        location: {
          address: 'Victoria Island',
          coordinates: { lat: 6.4281, lng: 3.4215 }
        },
        wasteType: 'general',
        description: 'Garbage dump near shopping complex',
        assignedAt: '2024-01-09T14:30:00Z',
        deadline: '2024-01-10T14:30:00Z',
        estimatedTime: 90,
        pointsValue: 100,
        reportImages: [],
        citizen: {
          id: 'citizen_2',
          name: 'Jane Smith',
          phone: '080***7890'
        }
      },
    ];
  },

  acceptTask: async (taskId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, taskId, newStatus: 'accepted' };
  },

  completeTask: async (taskId, completionData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { 
      success: true, 
      taskId, 
      newStatus: 'completed',
      completionData,
      completionTime: new Date().toISOString()
    };
  },

  getTaskHistory: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      { id: 'task_4', status: 'completed', completedAt: '2024-01-07T15:30:00Z', pointsEarned: 120 },
      { id: 'task_5', status: 'completed', completedAt: '2024-01-06T11:00:00Z', pointsEarned: 90 },
    ];
  }
};

export const fetchMyTasks = createAsyncThunk(
  'psp/fetchMyTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockApi.getMyTasks();
      return response;
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to fetch tasks'
      });
    }
  }
);

export const acceptTask = createAsyncThunk(
  'psp/acceptTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await mockApi.acceptTask(taskId);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to accept task'
      });
    }
  }
);

export const completeTask = createAsyncThunk(
  'psp/completeTask',
  async ({ taskId, completionData }, { rejectWithValue }) => {
    try {
      const response = await mockApi.completeTask(taskId, completionData);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to complete task'
      });
    }
  }
);

export const fetchTaskHistory = createAsyncThunk(
  'psp/fetchTaskHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockApi.getTaskHistory();
      return response;
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to fetch task history'
      });
    }
  }
);

const pspSlice = createSlice({
  name: 'psp',
  initialState: {
    tasks: [],
    taskHistory: [],
    isLoading: false,
    error: null,
    earnings: {
      today: 1250,
      week: 8450,
      month: 32500,
      totalPoints: 15600
    },
    stats: {
      completedToday: 3,
      pendingTasks: 2,
      completionRate: 85,
      averageTime: 75
    }
  },
  reducers: {
    updateTaskStatus: (state, action) => {
      const { taskId, status } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = status;
      }
    },
    updateEarnings: (state, action) => {
      state.earnings = { ...state.earnings, ...action.payload };
    },
    clearPspError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyTasks.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMyTasks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tasks = action.payload;
    });
    builder.addCase(fetchMyTasks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(acceptTask.fulfilled, (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = 'accepted';
      }
    });

    builder.addCase(completeTask.fulfilled, (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = 'completed';
        task.completedAt = action.payload.completionTime;
        task.completionProof = action.payload.completionData?.images || [];
      }
      state.stats.completedToday += 1;
      state.earnings.today += task?.pointsValue || 0;
    });

    builder.addCase(fetchTaskHistory.fulfilled, (state, action) => {
      state.taskHistory = action.payload;
    });
  }
});

export const { 
  updateTaskStatus, 
  updateEarnings, 
  clearPspError 
} = pspSlice.actions;

export default pspSlice.reducer;