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

// Mutex to prevent multiple simultaneous refresh attempts
let isRefreshing = false;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // 1. Run the initial request
  let result = await baseQuery(args, api, extraOptions);

  // 2. If it fails with 401, try to refresh
  if (result.error && result.error.status === 401) {
    // If the call that failed IS refresh, don't try again
    const url = typeof args === 'string' ? args : args.url;
    if (url.includes('/auth/refresh')) {
       api.dispatch(logout());
       return result;
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        // Try to get a new token
        const refreshResult = await baseQuery(
          { url: '/auth/refresh', method: 'POST' },
          api,
          extraOptions
        );

        console.log('[baseApi] /auth/refresh attempt. Result:', JSON.stringify(refreshResult));

        if (refreshResult.data) {
          const res = refreshResult.data as { success: boolean; data: { accessToken: string } };
          if (res.success && res.data.accessToken) {
            console.log('[baseApi] Refresh success, updating credentials');
            api.dispatch(setCredentials({ accessToken: res.data.accessToken }));
            
            // 3. Retry the original request with the new state
            // Explicitly clearing existing headers to let prepareHeaders set them correctly
            const retryArgs = typeof args === 'string' ? args : { ...args, headers: new Headers((args as any).headers) };
            result = await baseQuery(retryArgs, api, extraOptions);
            
            console.log('[baseApi] Retry result status:', result.error?.status || 'SUCCESS');
          } else {
            api.dispatch(logout());
          }
        } else {
          api.dispatch(logout());
        }
      } finally {
        isRefreshing = false;
      }
    } else {
      // If already refreshing, we could wait or just return the 401
      // For simplicity, we just return the error and let the component handle it or trigger a login
      // result = await someMutationToWaitForRefresh(); 
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Listing', 'Referral', 'Subscription', 'Room', 'Booking'],
  endpoints: () => ({}),
});
