// import create slice from reduxjs toolkit
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Define initial state
const initialState = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
};

// Thunk for registering a user
export const registerUser = createAsyncThunk('/auth/register', async (formData) => {
    const response = await fetch("http://localhost:4000/api/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // Adjust based on your API requirement
    });
    return response.json();
});

// Thunk for logging in a user
export const loginUser = createAsyncThunk('/auth/login', async (formData, { dispatch }) => {
    const response = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  
    const result = await response.json();
  
    if (response.ok && result.success) {
      dispatch(setUser(result.user)); // Update the user state
    }
  
    return result;
  });

// Thunk for check user authentication
export const checkAuth = createAsyncThunk('/auth/checkauth', async () => {
  // console.log(checkAuth);
  try {
      const response = await axios.get("http://localhost:4000/api/auth/check-auth", {
          method: 'get',
          credentials: 'include', // Include cookies
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
  } catch (error) {
      console.error('CheckAuth Error:', error);
      throw error;
  }
});

  // Create slice
  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setUser: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      },
      logout: (state) => {
        state.isAuthenticated = false;
        state.user = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(loginUser.pending, (state) => {
          state.isLoading = true;
        })      
        .addCase(loginUser.fulfilled, (state, action) => {
          state.isLoading = false;
          if (action.payload?.success) {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            localStorage.setItem('authUser', JSON.stringify(action.payload.user)); // Save user data
          }
        })        
        .addCase(loginUser.rejected, (state) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        })
        .addCase(checkAuth.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(checkAuth.fulfilled, (state, action) => {
          state.isLoading = false;
          if (action.payload && action.payload.success) {
            state.user = action.payload.user;
            state.isAuthenticated = true;
          } else {
            state.user = null;
            state.isAuthenticated = false;
          }
        })
        .addCase(checkAuth.rejected, (state) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        });
    },
  });
  
  // Export reducer and actions
  export const { setUser, logout } = authSlice.actions;
  export default authSlice.reducer;