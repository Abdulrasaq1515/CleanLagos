import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API calls for now
const mockAPI = {
  login: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication logic
    if (credentials.email && credentials.password) {
      const mockUsers = {
        'citizen@cleanlagos.com': { id: 1, email: 'citizen@cleanlagos.com', role: 'citizen', name: 'John Citizen' },
        'psp@cleanlagos.com': { id: 2, email: 'psp@cleanlagos.com', role: 'psp_worker', name: 'PSP Worker' },
        'admin@cleanlagos.com': { id: 3, email: 'admin@cleanlagos.com', role: 'lawma_admin', name: 'Admin User' },
        'recycler@cleanlagos.com': { id: 4, email: 'recycler@cleanlagos.com', role: 'recycler', name: 'Recycler User' },
      };
      
      const user = mockUsers[credentials.email];
      if (user) {
        return {
          user,
          token: `mock_token_${user.id}_${Date.now()}`,
        };
      }
    }
    
    throw new Error('Invalid credentials');
  },
  
  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (userData.email && userData.password && userData.name) {
      return {
        user: {
          id: Date.now(),
          email: userData.email,
          name: userData.name,
          role: userData.role || 'citizen',
        },
        token: `mock_token_${Date.now()}`,
      };
    }
    
    throw new Error('Registration failed');
  },
  
  fetchCurrentUser: async (token) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (token && token.startsWith('mock_token_')) {
      const userId = token.split('_')[2];
      return {
        id: parseInt(userId),
        email: 'user@cleanlagos.com',
        name: 'Current User',
        role: 'citizen',
      };
    }
    
    throw new Error('Invalid token');
  },
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await mockAPI.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await mockAPI.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        throw new Error('No token available');
      }
      const user = await mockAPI.fetchCurrentUser(auth.token);
      return user;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  otpState: {
    loading: false,
    sent: false,
    verified: false,
    error: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.otpState = initialState.otpState;
    },
    clearError: (state) => {
      state.error = null;
      state.otpState.error = null;
    },
    setMockUser: (state, action) => {
      state.user = action.payload;
      state.token = `mock_token_${action.payload.id}_${Date.now()}`;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    clearOTPState: (state) => {
      state.otpState = initialState.otpState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
      });
  },
});

export const { logout, clearError, setMockUser, clearOTPState } = authSlice.actions;
export default authSlice.reducer;