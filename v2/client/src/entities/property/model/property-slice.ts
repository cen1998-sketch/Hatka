import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Property, PropertyState, PropertyDraftState } from './types.ts';
export type { Property, PropertyState, PropertyDraftState };
import { api } from '../../../shared/api/api-base.ts';
import type { RootState } from '../../../app/store.ts';

const initialDraft: PropertyDraftState = {
  currentStep: 1,
  isSaving: false,
  lastSavedAt: null,
  type: 'APARTMENT',
  subType: 'Квартира',
  title: '',
  address: '',
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
};

const initialState: PropertyState = {
  data: [],
  draft: initialDraft,
  status: 'idle',
  error: null,
};

export const savePropertyDraft = createAsyncThunk(
  'property/saveDraft',
  async (draft: Partial<Property>, { rejectWithValue }) => {
    try {
      const response = await api.post('/properties/draft', draft);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to save draft');
    }
  }
);

// ... existing thunks ...

export const fetchProperties = createAsyncThunk('property/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/properties');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch properties');
  }
});

export const fetchSearchProperties = createAsyncThunk(
  'property/fetchSearch',
  async (params: any, { rejectWithValue }) => {
    try {
      const { city, checkIn, checkOut, guests, minPrice, maxPrice, housingTypes } = params;
      const response = await api.get('/properties/search', {
        params: {
          city,
          checkIn,
          checkOut,
          guests,
          minPrice,
          maxPrice,
          housingTypes: housingTypes.join(','),
        }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Search failed');
    }
  }
);

export const createProperty = createAsyncThunk(
  'property/create',
  async (propertyData: Partial<Property>, { rejectWithValue }) => {
    try {
      const response = await api.post('/properties', propertyData);
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
      .addCase(savePropertyDraft.pending, (state) => {
        state.draft.isSaving = true;
      })
      .addCase(savePropertyDraft.fulfilled, (state, action: PayloadAction<Property>) => {
        state.draft.isSaving = false;
        state.draft.id = action.payload.id;
        state.draft.lastSavedAt = new Date().toISOString();
      })
      .addCase(savePropertyDraft.rejected, (state) => {
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
      .addCase(createProperty.fulfilled, (state, action: PayloadAction<Property>) => {
        state.data.unshift(action.payload);
      });
  },
});

export const { updateDraft, setStep, resetDraft } = propertySlice.actions;

export const selectPropertyDraft = (state: RootState) => state.property.draft;
export const selectAllProperties = (state: RootState) => state.property.data;
export const selectPropertyStatus = (state: RootState) => state.property.status;

export default propertySlice.reducer;
