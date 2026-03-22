import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from '../entities/property/model/property-slice.ts';
import authReducer from '../entities/user/model/auth-slice.ts';
import searchReducer from '../features/search-properties/model/search-slice.ts';

export const store = configureStore({
  reducer: {
    property: propertyReducer,
    auth: authReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
