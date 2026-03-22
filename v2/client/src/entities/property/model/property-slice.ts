import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Property, PropertyState } from './types.ts';
export type { Property, PropertyState };
import { api } from '../../../shared/api/api-base.ts';
import type { RootState } from '../../../app/store.ts';

const initialState: PropertyState = {
  data: [
    {
      id: '1',
      title: 'Томск, Савиных улица, 4А',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
      price: '3000',
      rating: '9.8',
      reviews: '120',
      location: 'Кировский р-н',
      specs: { guests: '2 гостя', beds: '1 кровать', area: '18 м²' }
    },
    {
      id: '2',
      title: 'Томск, проспект Ленина, 121',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'],
      price: '4500',
      rating: '9.5',
      reviews: '85',
      location: 'Ленинский р-н',
      specs: { guests: '4 гостя', beds: '2 кровати', area: '45 м²' }
    },
    {
      id: '3',
      title: 'Томск, улица Кирова, 15',
      image: 'https://images.unsplash.com/photo-1449156001437-3a16d1dfda86?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1449156001437-3a16d1dfda86?auto=format&fit=crop&q=80&w=800'],
      price: '2800',
      rating: '9.0',
      reviews: '42',
      location: 'Советский р-н',
      specs: { guests: '2 гостя', beds: '1 кровать', area: '22 м²' }
    },
    {
      id: '4',
      title: 'Томск, Комсомольский пр-т, 70',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800'],
      price: '5200',
      rating: '9.9',
      reviews: '210',
      location: 'Октябрьский р-н',
      specs: { guests: '6 гостей', beds: '3 кровати', area: '75 м²' }
    }
  ],
  status: 'idle',
  error: null,
};

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
      return response.data.data; // Бэкенд возвращает { success: true, data: [...] }
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
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchSearchProperties.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSearchProperties.fulfilled, (state, action: PayloadAction<Property[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchSearchProperties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Search failed';
      })
      .addCase(createProperty.fulfilled, (state, action: PayloadAction<Property>) => {
        state.data.unshift(action.payload);
      });
  },
});

export const selectAllProperties = (state: RootState) => state.property.data;
export const selectPropertyStatus = (state: RootState) => state.property.status;

export default propertySlice.reducer;
