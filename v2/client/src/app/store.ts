import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../shared/api/baseApi.ts';
import propertyReducer from '../entities/property/model/property-slice.ts';
import authReducer from '../entities/user/model/auth-slice.ts';
import searchReducer from '../features/search-properties/model/search-slice.ts';
import propertyDraftReducer from '../entities/property/model/draft-slice';
import listingCreateReducer from '../features/listing-create/model/listingSlice.ts';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    property: propertyReducer,
    propertyDraft: propertyDraftReducer,
    auth: authReducer,
    search: searchReducer,
    listingCreate: listingCreateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
