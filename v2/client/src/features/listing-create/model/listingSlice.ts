import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type ListingType = 'APARTMENT' | 'HOUSE' | 'ROOM' | 'HOTEL_ROOM' | 'PRIVATE_ROOM'

export interface RoomDraft {
  id?: string
  title: string
  type: string
  area: number
  capacityAdults: number
  capacityChildren: number
  beds: { type: string; count: number }[]
  amenities: string[]
  pricePerDay: number
  priceLongTerm?: number
  instantBooking: boolean
  quantity: number
  photos: any[]
}

interface ListingDraft {
  id?: string
  step: number
  isEditingRoom?: boolean
  type?: ListingType
  status?: string
  moderationComment?: string
  moderationDetails?: Record<string, string>
  title?: string
  description?: string
  city?: string
  region?: string
  streetType?: string
  streetName?: string
  houseNumber?: string
  building?: string
  latitude?: number
  longitude?: number
  checkIn?: string
  checkOut?: string
  yearBuilt?: number
  roomCount?: number
  pricePerDay?: number
  photos: { id: string; url: string; thumbnailUrl: string }[]
  details: {
    hotelType?: string
    registryNumber?: string
    starsCategory?: string
    registryType?: string
    paymentMethod?: string
    smokingPolicy?: string
    hasInternet?: string
    parkingPolicy?: string
    diningPolicy?: {
      type: string
      manual?: {
        breakfast?: string
        lunch?: string
        dinner?: string
      }
    }
    extraServices?: {
      cleaning?: { type: string; price?: number }
      linen?: { type: string; price?: number }
      hasReportingDocuments?: boolean
      hasTransfer?: boolean
    }
    [key: string]: any
  }
  amenities: string[]
  rooms: RoomDraft[]
  stepsCompleted: number
}

const initialState: ListingDraft = {
  step: 1,
  isEditingRoom: false,
  title: '',
  description: '',
  city: '',
  streetType: '',
  streetName: '',
  houseNumber: '',
  photos: [],
  details: {},
  amenities: [],
  rooms: [],
  stepsCompleted: 0,
  checkIn: '14:00',
  checkOut: '12:00',
}

const listingSlice = createSlice({
  name: 'listingCreate',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload
    },
    setListing: (state, action: PayloadAction<Partial<ListingDraft>>) => {
      return { ...state, ...action.payload }
    },
    updateDraft: (state, action: PayloadAction<Partial<ListingDraft>>) => {
      const { photos, amenities, rooms, ...rest } = action.payload
      return { 
        ...state, 
        ...rest,
        photos: Array.isArray(photos) ? photos : (state.photos || []),
        amenities: Array.isArray(amenities) ? amenities : (state.amenities || []),
        rooms: Array.isArray(rooms) ? rooms : (state.rooms || []),
      }
    },
    setRooms: (state, action: PayloadAction<RoomDraft[]>) => {
      state.rooms = action.payload
    },
    completeStep: (state, action: PayloadAction<number>) => {
      if (action.payload > state.stepsCompleted) {
        state.stepsCompleted = action.payload
      }
    },
    setIsEditingRoom: (state, action: PayloadAction<boolean>) => {
      state.isEditingRoom = action.payload
    },
    resetDraft: () => initialState,
  },
})

export const { 
  setStep, 
  setListing, 
  updateDraft, 
  setRooms, 
  resetDraft, 
  completeStep,
  setIsEditingRoom
} = listingSlice.actions
export default listingSlice.reducer
