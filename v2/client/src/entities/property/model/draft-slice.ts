import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../../shared/api/api-base.ts';

export const submitProperty = createAsyncThunk(
  'propertyDraft/submit',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const draft = state.propertyDraft;
      const response = await api.post('/properties', draft);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit property');
    }
  }
);

export interface RoomDraft {
  id: string; // Local UUID
  title: string;
  description: string;
  price: number;
  capacity: number;
  beds: number;
  size: number;
  images: string[]; // Base64 strings
}

export interface PropertyDraftState {
  // Step 1
  type: 'HOTEL_ROOM' | 'APARTMENT' | 'HOUSE' | 'PRIVATE_ROOM';
  subType: string;
  city: string;
  
  // Basic Info
  title: string;
  description: string;
  address: string;
  streetType: string;
  streetName: string;
  houseNumber: string;
  buildingBlock: string;
  registryNumber: string;
  starRating: number;
  registryType: string;

  // Sutochno.ru specific sections
  hasWifi: 'none' | 'free' | 'paid';
  hasParking: 'none' | 'free' | 'paid';
  meals: 'none' | 'breakfast' | 'half_board' | 'full_board' | 'all_inclusive';
  
  rules: {
    smoking: boolean;
    parties: boolean;
    pets: boolean;
    children: boolean;
  };
  
  // Photos & Amenities
  images: string[];
  amenityIds: string[];
  
  // Step 3 (Rooms)
  rooms: RoomDraft[];
  
  // UI State
  currentStep: number;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: PropertyDraftState = {
  type: 'APARTMENT',
  subType: '',
  city: '',
  title: '',
  description: '',
  address: '',
  streetType: 'Улица',
  streetName: '',
  houseNumber: '',
  buildingBlock: '',
  registryNumber: '',
  starRating: 0,
  registryType: '',
  hasWifi: 'none',
  hasParking: 'none',
  meals: 'none',
  rules: {
    smoking: false,
    parties: false,
    pets: false,
    children: true,
  },
  images: [],
  amenityIds: [],
  rooms: [],
  currentStep: 1,
  isSubmitting: false,
  error: null,
};

const propertyDraftSlice = createSlice({
  name: 'propertyDraft',
  initialState,
  reducers: {
    updateDraft: (state, action: PayloadAction<Partial<PropertyDraftState>>) => {
      return { ...state, ...action.payload };
    },
    addRoom: (state, action: PayloadAction<RoomDraft>) => {
      state.rooms.push(action.payload);
    },
    updateRoom: (state, action: PayloadAction<{ id: string; data: Partial<RoomDraft> }>) => {
      const index = state.rooms.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.rooms[index] = { ...state.rooms[index], ...action.payload.data };
      }
    },
    removeRoom: (state, action: PayloadAction<string>) => {
      state.rooms = state.rooms.filter(r => r.id !== action.payload);
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    prevStep: (state) => {
      if (state.currentStep > 1) state.currentStep -= 1;
    },
    resetDraft: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitProperty.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitProperty.fulfilled, (state) => {
        state.isSubmitting = false;
        return initialState; // Fully reset after success
      })
      .addCase(submitProperty.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  updateDraft, 
  addRoom, 
  updateRoom, 
  removeRoom, 
  nextStep, 
  prevStep, 
  resetDraft 
} = propertyDraftSlice.actions;

export const selectPropertyDraft = (state: any) => state.propertyDraft;

export default propertyDraftSlice.reducer;
