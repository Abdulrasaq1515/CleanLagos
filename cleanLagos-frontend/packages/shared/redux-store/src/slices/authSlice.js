import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/api';

// Storage abstraction - use localStorage for web
const storage = {
  getItem: async (key) => {
    return localStorage.getItem(key);
  },
  setItem: async (key, value) => {
    return localStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    return localStorage.removeItem(key);
  },
};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const verifyPhone = createAsyncThunk(
  'auth/verifyPhone',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyPhone(data);
      if (response.data.token) {
        await storage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.data.token) {
        await storage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getMe();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Get initial token from storage
const getInitialToken = async () => {
  try {
    return await storage.getItem('token');
  } catch (error) {
    return null;
  }
};

const initialState = {
  user: null,
  token: null, // Will be hydrated by redux-persist
  isAuthenticated: false,
  loading: false,
  error: null,
  registrationStep: 'register', // 'register' | 'verify'
  tempUserId: null,
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
      // Remove token from storage asynchronously
      storage.removeItem('token').catch(console.error);
    },
    clearError: (state) => {
      state.error = null;
    },
    setRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationStep = 'verify';
        state.tempUserId = action.payload.userId;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify Phone
      .addCase(verifyPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.registrationStep = 'register';
        state.tempUserId = null;
      })
      .addCase(verifyPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
        storage.removeItem('token').catch(console.error);
      });
  },
});

export const { logout, clearError, setRegistrationStep } = authSlice.actions;
export default authSlice.reducer;
