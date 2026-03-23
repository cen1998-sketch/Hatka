import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../../shared/api/api-base.ts';

export const fetchCities = createAsyncThunk('search/fetchCities', async () => {
  const response = await api.get('/cities');
  return response.data.data;
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
  amenities: string[];
  minRating: number;
  rooms: number;
  bedrooms: number;
  beds: number;
  doubleBeds: number;
  areaMin: number;
  areaMax: number;
  floorMin: number;
  floorMax: number;
  smoking: boolean;
  parties: boolean;
  noDeposit: boolean;
  sort: string;
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
  amenities: [],
  minRating: 0,
  rooms: 0,
  bedrooms: 0,
  beds: 0,
  doubleBeds: 0,
  areaMin: 0,
  areaMax: 500,
  floorMin: 0,
  floorMax: 100,
  smoking: false,
  parties: false,
  noDeposit: false,
  sort: 'popular',
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
    setAmenities(state, action: PayloadAction<string[]>) {
      state.amenities = action.payload;
    },
    toggleAmenity(state, action: PayloadAction<string>) {
      state.amenities = state.amenities.includes(action.payload)
        ? state.amenities.filter(a => a !== action.payload)
        : [...state.amenities, action.payload];
    },
    setMinRating(state, action: PayloadAction<number>) {
      state.minRating = action.payload;
    },
    setRoomFilters(state, action: PayloadAction<{ rooms?: number; bedrooms?: number; beds?: number; doubleBeds?: number }>) {
      if (action.payload.rooms !== undefined) state.rooms = action.payload.rooms;
      if (action.payload.bedrooms !== undefined) state.bedrooms = action.payload.bedrooms;
      if (action.payload.beds !== undefined) state.beds = action.payload.beds;
      if (action.payload.doubleBeds !== undefined) state.doubleBeds = action.payload.doubleBeds;
    },
    setAreaRange(state, action: PayloadAction<{ min?: number; max?: number }>) {
      if (action.payload.min !== undefined) state.areaMin = action.payload.min;
      if (action.payload.max !== undefined) state.areaMax = action.payload.max;
    },
    setFloorRange(state, action: PayloadAction<{ min?: number; max?: number }>) {
      if (action.payload.min !== undefined) state.floorMin = action.payload.min;
      if (action.payload.max !== undefined) state.floorMax = action.payload.max;
    },
    setRules(state, action: PayloadAction<{ smoking?: boolean; parties?: boolean; noDeposit?: boolean }>) {
      if (action.payload.smoking !== undefined) state.smoking = action.payload.smoking;
      if (action.payload.parties !== undefined) state.parties = action.payload.parties;
      if (action.payload.noDeposit !== undefined) state.noDeposit = action.payload.noDeposit;
    },
    setSort(state, action: PayloadAction<string>) {
      state.sort = action.payload;
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
  setAmenities,
  toggleAmenity,
  setMinRating,
  setRoomFilters,
  setAreaRange,
  setFloorRange,
  setRules,
  setSort,
  resetSearch 
} = searchParamsSlice.actions;

export default searchParamsSlice.reducer;
