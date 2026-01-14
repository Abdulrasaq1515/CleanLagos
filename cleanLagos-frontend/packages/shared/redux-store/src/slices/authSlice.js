import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API function for now (replace with real API later)
const mockApi = {
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Determine role based on email for testing
    let role = 'citizen';
    if (email.includes('psp')) role = 'psp_worker';
    if (email.includes('admin')) role = 'lawma_admin';
    if (email.includes('recycler')) role = 'recycler';
    
    return {
      user: {
        id: 'user_' + Date.now(),
        email: email,
        fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: role,
        points: role === 'citizen' ? 100 : 0,
        phone: '+234' + Math.floor(Math.random() * 9000000000 + 1000000000)
      },
      token: 'mock_jwt_token_' + Date.now()
    };
  },
  
  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      user: {
        id: 'user_' + Date.now(),
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role || 'citizen',
        points: 0,
        phone: userData.phone
      },
      token: 'mock_jwt_token_' + Date.now()
    };
  },
  
  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: 'user_123',
      email: 'test@cleanlagos.com',
      fullName: 'Test User',
      role: 'citizen',
      points: 100,
      phone: '+2348012345678'
    };
  },
  
  sendOTP: async (phone) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('OTP sent to:', phone);
    return { success: true, message: 'OTP sent successfully' };
  },
  
  verifyOTP: async (phone, otp) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    // Mock OTP verification - accept "1234" as valid OTP
    if (otp === '1234') {
      return { success: true, verified: true };
    }
    throw new Error('Invalid OTP');
  },
  
  resetPassword: async (email) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Password reset link sent to:', email);
    return { success: true, message: 'Password reset link sent' };
  }
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await mockApi.login(email, password);
      console.log('Login successful:', response.user.email);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Login failed. Please try again.'
      });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await mockApi.register(userData);
      console.log('Registration successful:', response.user.email);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Registration failed. Please try again.'
      });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockApi.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to fetch user data'
      });
    }
  }
);

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (phone, { rejectWithValue }) => {
    try {
      const response = await mockApi.sendOTP(phone);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to send OTP'
      });
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const response = await mockApi.verifyOTP(phone, otp);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Invalid OTP'
      });
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await mockApi.resetPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to reset password'
      });
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ token, email, newPassword }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
       
      // Mock API call - replace with real API
      // const response = await apiClient.post('/auth/change-password', {
      //   token,
      //   email,
      //   newPassword
      // });
      
      console.log('Password changed successfully for:', email);
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to change password'
      });
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    otpSent: false,
    otpVerified: false,
    passwordResetSent: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.otpVerified = false;
      console.log('User logged out');
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setMockUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      console.log('Mock user set:', action.payload.role);
    },
    clearOTPState: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch current user
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    
    // Send OTP
    builder.addCase(sendOTP.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sendOTP.fulfilled, (state) => {
      state.isLoading = false;
      state.otpSent = true;
    });
    builder.addCase(sendOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    
    // Verify OTP
    builder.addCase(verifyOTP.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyOTP.fulfilled, (state) => {
      state.isLoading = false;
      state.otpVerified = true;
    });
    builder.addCase(verifyOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    
    // Reset Password
    builder.addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.isLoading = false;
      state.passwordResetSent = true;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(changePassword.pending, (state) => {
       state.isLoading = true;
       state.error = null;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
       state.isLoading = false;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
       state.isLoading = false;
       state.error = action.payload;
    });
  },
});

export const { logout, clearError, setToken, setMockUser, clearOTPState } = authSlice.actions;
export default authSlice.reducer;