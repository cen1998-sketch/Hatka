import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../../shared/api/api-base.ts';

interface User {
  id: string;
  email: string;
  role: 'tenant' | 'landlord' | 'moderator' | 'admin';
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk('auth/login', async ({ email, role }: { email: string, role: string }) => {
  const response = await api.post('/auth/login', { email, role });
  return response.data;
});

export const verifyToken = createAsyncThunk('auth/verify', async (token: string) => {
  const response = await api.get(`/auth/verify?token=${token}`);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyToken.fulfilled, (state, action: PayloadAction<{ user: User, token: string }>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        state.status = 'succeeded';
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Verification failed';
      });
  }
});

export const { logout } = authSlice.actions;
export const selectUser = (state: any) => state.auth.user;

export default authSlice.reducer;
