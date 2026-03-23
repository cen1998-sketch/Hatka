import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { logout, setCredentials } from '../../entities/user/model/auth-slice';
import type { RootState } from '../../app/store';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Optional: check if we have a token or if we are already refreshing
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // If it's a 401, don't immediately logout, try refresh
    if ((args as FetchArgs).url === '/auth/refresh') {
       // If the refresh call itself is 401, then definitely logout
       api.dispatch(logout());
       return result;
    }
    // Try to get a new token via refresh endpoint (requires httpOnly cookie)
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );

    console.log('[baseApi] /auth/refresh attempt. Result:', JSON.stringify(refreshResult));

    if (refreshResult.data) {
      const res = refreshResult.data as { success: boolean; data: { accessToken: string } };
      if (res.success && res.data.accessToken) {
        console.log('[baseApi] Refresh success, retry original request');
        api.dispatch(setCredentials({ accessToken: res.data.accessToken }));
        
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.warn('[baseApi] Refresh returned success:false, logging out');
        api.dispatch(logout());
      }
    } else {
      console.error('[baseApi] Refresh failed (no data), logging out. Error:', JSON.stringify(refreshResult.error));
      api.dispatch(logout());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Listing', 'Referral', 'Subscription', 'Room'],
  endpoints: () => ({}),
});
