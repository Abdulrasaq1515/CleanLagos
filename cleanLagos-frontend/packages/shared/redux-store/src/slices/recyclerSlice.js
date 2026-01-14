import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const mockApi = {
  getRecyclingTasks: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 'recycle_1',
        type: 'plastic',
        weight: 25.5,
        location: 'Lagos Recycling Center',
        status: 'pending',
        points: 200,
        createdAt: '2024-01-10T08:00:00Z',
        deadline: '2024-01-12T18:00:00Z',
      },
      {
        id: 'recycle_2',
        type: 'electronic',
        weight: 15.2,
        location: 'E-Waste Facility',
        status: 'in_progress',
        points: 350,
        createdAt: '2024-01-09T10:30:00Z',
        deadline: '2024-01-11T16:00:00Z',
      },
    ];
  },

  completeRecycling: async (taskId, completionData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      taskId,
      pointsEarned: completionData.points || 150,
      completedAt: new Date().toISOString(),
    };
  },
};

export const fetchRecyclingTasks = createAsyncThunk(
  'recycler/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockApi.getRecyclingTasks();
      return response;
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to fetch recycling tasks'
      });
    }
  }
);

export const completeRecyclingTask = createAsyncThunk(
  'recycler/completeTask',
  async ({ taskId, completionData }, { rejectWithValue }) => {
    try {
      const response = await mockApi.completeRecycling(taskId, completionData);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to complete recycling task'
      });
    }
  }
);

const recyclerSlice = createSlice({
  name: 'recycler',
  initialState: {
    tasks: [],
    isLoading: false,
    error: null,
    stats: {
      totalRecycled: 1250.5,
      totalPoints: 15600,
      tasksCompleted: 42,
      efficiency: 92,
    },
    materials: [
      { type: 'plastic', recycled: 450.2, points: 5400 },
      { type: 'electronic', recycled: 120.8, points: 3600 },
      { type: 'organic', recycled: 520.3, points: 4160 },
      { type: 'metal', recycled: 159.2, points: 2440 },
    ],
  },
  reducers: {
    clearRecyclerError: (state) => {
      state.error = null;
    },
    updateMaterialStats: (state, action) => {
      const { type, weight, points } = action.payload;
      const material = state.materials.find(m => m.type === type);
      if (material) {
        material.recycled += weight;
        material.points += points;
      }
      state.stats.totalRecycled += weight;
      state.stats.totalPoints += points;
      state.stats.tasksCompleted += 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRecyclingTasks.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchRecyclingTasks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tasks = action.payload;
    });
    builder.addCase(fetchRecyclingTasks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(completeRecyclingTask.fulfilled, (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = 'completed';
        task.completedAt = action.payload.completedAt;
      }
      state.stats.tasksCompleted += 1;
      state.stats.totalPoints += action.payload.pointsEarned;
    });
  },
});

export const { clearRecyclerError, updateMaterialStats } = recyclerSlice.actions;
export default recyclerSlice.reducer;