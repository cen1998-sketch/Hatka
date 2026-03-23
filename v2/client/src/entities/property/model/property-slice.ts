import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Property, PropertyState, PropertyDraftState, Booking } from './types.ts';
export type { Property, PropertyState, PropertyDraftState, Booking };
import { api } from '../../../shared/api/api-base.ts';
import type { RootState } from '../../../app/store.ts';

const initialDraft: PropertyDraftState = {
  currentStep: 1,
  isSaving: false,
  lastSavedAt: null,
  type: 'APARTMENT',
  subType: 'Квартира',
  title: '',
  city: '',
  streetType: 'Улица',
  streetName: '',
  houseNumber: '',
  buildingBlock: '',
  landmarks: '',
  description: '',
  pricePerNight: 0,
  rooms: 1,
  bedrooms: 1,
  beds: 1,
  doubleBeds: 0,
  maxGuests: 2,
  children: true,
  isAllInclusive: false,
  hasReportingDocs: false,
  hasTransfer: false,
  hotelRooms: [],
  amenities: [],
  images: [],
  checkIn: '14:00',
  checkOut: '12:00',
  smoking: 'FORBIDDEN',
  paymentMethod: 'CASH_AND_CARD',
};

const initialState: PropertyState = {
  data: [],
  draft: initialDraft,
  ownerBookings: [],
  status: 'idle',
  error: null,
};

export const saveDraftThunk = createAsyncThunk(
  'property/saveDraft',
  async (draft: Partial<Property>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const currentDraft = draft || state.property.draft;
      const response = await api.post('/properties/draft', currentDraft);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to save draft');
    }
  }
);

export const fetchProperties = createAsyncThunk('property/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/properties');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch properties');
  }
});

export const fetchSearchProperties = createAsyncThunk(
  'property/fetchSearch',
  async (params: any, { rejectWithValue }) => {
    try {
      const { 
        city, checkIn, checkOut, guests, 
        minPrice, maxPrice, housingTypes,
        amenities, minRating, rooms, bedrooms, beds, sort
      } = params;
      const response = await api.get('/properties/search', {
        params: {
          city,
          checkIn,
          checkOut,
          guests,
          minPrice,
          maxPrice,
          housingTypes: (housingTypes || []).join(','),
          amenities: (amenities || []).join(','),
          minRating,
          rooms,
          bedrooms,
          beds,
          sort
        }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Search failed');
    }
  }
);

export const fetchMyProperties = createAsyncThunk(
  'property/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/properties/my');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch your properties');
    }
  }
);

export const fetchOwnerBookings = createAsyncThunk(
  'property/fetchOwnerBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings/owner');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch owner bookings');
    }
  }
);

export const submitPropertyThunk = createAsyncThunk(
  'property/create',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const draft = state.property.draft;
      const response = await api.post('/properties', draft);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create property');
    }
  }
);

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    updateDraft: (state, action: PayloadAction<Partial<Property>>) => {
      state.draft = { ...state.draft, ...action.payload };
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.draft.currentStep = action.payload;
    },
    resetDraft: (state) => {
      state.draft = initialDraft;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveDraftThunk.pending, (state) => {
        state.draft.isSaving = true;
      })
      .addCase(saveDraftThunk.fulfilled, (state, action: PayloadAction<Property>) => {
        state.draft.isSaving = false;
        state.draft.id = action.payload.id;
        state.draft.lastSavedAt = new Date().toISOString();
      })
      .addCase(saveDraftThunk.rejected, (state) => {
        state.draft.isSaving = false;
      })
      .addCase(fetchProperties.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProperties.fulfilled, (state, action: PayloadAction<Property[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch properties';
      })
      .addCase(fetchSearchProperties.fulfilled, (state, action: PayloadAction<Property[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(submitPropertyThunk.fulfilled, (state, action: PayloadAction<Property>) => {
        state.data.unshift(action.payload);
        state.draft = initialDraft; // Reset after successful submission
      })
      .addCase(fetchMyProperties.fulfilled, (state, action: PayloadAction<Property[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchOwnerBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.ownerBookings = action.payload;
      });
  },
});

export const { updateDraft, setStep, resetDraft } = propertySlice.actions;

export const selectPropertyDraft = (state: RootState) => state.property.draft;
export const selectAllProperties = (state: RootState) => state.property.data;
export const selectMyProperties = (state: RootState) => state.property.data;
export const selectOwnerBookings = (state: RootState) => state.property.ownerBookings;
export const selectPropertyStatus = (state: RootState) => state.property.status;

export default propertySlice.reducer;
