import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../../shared/api/api-base.ts';

export const fetchCities = createAsyncThunk('search/fetchCities', async () => {
  const response = await api.get('/cities');
  return response.data;
});

export interface SearchParamsState {
  city: string;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  minPrice: number;
  maxPrice: number;
  housingTypes: string[];
  instantBooking: boolean;
  availableCities: string[];
}

const initialState: SearchParamsState = {
  city: 'Томск',
  checkIn: null,
  checkOut: null,
  guests: 1,
  minPrice: 0,
  maxPrice: 50000,
  housingTypes: ['apartments'],
  instantBooking: false,
  availableCities: [],
};

const searchParamsSlice = createSlice({
  name: 'searchParams',
  initialState,
  reducers: {
    setCity(state, action: PayloadAction<string>) {
      state.city = action.payload;
    },
    setDates(state, action: PayloadAction<{ checkIn: string | null; checkOut: string | null }>) {
      state.checkIn = action.payload.checkIn;
      state.checkOut = action.payload.checkOut;
    },
    setGuests(state, action: PayloadAction<number>) {
      state.guests = action.payload;
    },
    setPriceRange(state, action: PayloadAction<[number, number]>) {
      state.minPrice = action.payload[0];
      state.maxPrice = action.payload[1];
    },
    setHousingTypes(state, action: PayloadAction<string[]>) {
      state.housingTypes = action.payload;
    },
    setInstantBooking(state, action: PayloadAction<boolean>) {
      state.instantBooking = action.payload;
    },
    resetSearch(state) {
      const { availableCities } = state;
      return { ...initialState, availableCities };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCities.fulfilled, (state, action) => {
      state.availableCities = action.payload;
    });
  }
});

export const { 
  setCity, 
  setDates, 
  setGuests, 
  setPriceRange, 
  setHousingTypes, 
  setInstantBooking,
  resetSearch 
} = searchParamsSlice.actions;

export default searchParamsSlice.reducer;
