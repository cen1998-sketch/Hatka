import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { setLegacyToken } from '../../../shared/api/api-base.ts';

export interface User {
  id: string;
  email: string;
  role: 'GUEST' | 'HOST' | 'BOTH' | 'MODERATOR' | 'ADMIN' | 'tenant' | 'landlord'; // Added legacy roles for compatibility
  firstName?: string;
  lastName?: string;
  name?: string; // Legacy field
  phone?: string;
  city?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  accessToken: null, // Access token is only in memory
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state, 
      action: PayloadAction<{ user?: User; accessToken: string }>
    ) => {
      const { user, accessToken } = action.payload;
      if (user) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      }
      state.accessToken = accessToken;
      setLegacyToken(accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem('user');
      setLegacyToken(null);
      // refresh token is cleared on backend via cookie
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    // Автоматически обновляем данные пользователя из RTK Query
      builder.addMatcher(
        (action) => action.type.endsWith('getProfile/fulfilled'),
        (state, action: PayloadAction<{ success: boolean; data: User }>) => {
          console.log('[AuthSlice] Profile fulfilled, updating user state');
          if (action.payload?.success && action.payload.data) {
            state.user = action.payload.data;
            localStorage.setItem('user', JSON.stringify(action.payload.data));
          }
        }
      );
  },
});

export const { setCredentials, logout, setInitialized } = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.accessToken;

export default authSlice.reducer;
