import { z } from 'zod'

export const searchSchema = z.object({
  city: z.string().optional(),
  checkIn: z.string().datetime().optional(),
  checkOut: z.string().datetime().optional(),
  adults: z.coerce.number().min(1).max(20).optional(),
  type: z.enum(['APARTMENT', 'HOUSE', 'ROOM']).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  amenities: z.string().optional(), // "wifi,tv"
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
})

export const createListingSchema = z.object({
  type: z.enum(['APARTMENT', 'HOUSE', 'ROOM', 'HOTEL_ROOM', 'PRIVATE_ROOM']),
  title: z.string().max(100).optional(),
  description: z.string().max(5000).optional(),
  city: z.string().optional(),
  streetType: z.string().optional(),
  streetName: z.string().optional(),
  houseNumber: z.string().optional(),
  building: z.string().optional(),
  region: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  pricePerDay: z.number().optional(),
  amenities: z.any().optional(),
  details: z.record(z.string(), z.any()).optional(),
  stepsCompleted: z.number().optional(),
})

export const updateListingSchema = createListingSchema.partial()

// Схемы для отдельных шагов
export const stepSchemas: Record<number, z.ZodObject<any>> = {
  // Шаг 1: Выбор категории и города
  1: z.object({
    details: z.object({
      hotelType: z.string(),
    }),
    city: z.string().min(2),
  }),
  // Шаг 2: Основная информация (13 разделов)
  2: z.object({
    title: z.string().min(1).max(255),
    streetType: z.string().min(1),
    streetName: z.string().min(1),
    houseNumber: z.string().min(1),
    building: z.string().nullable().optional(),
    details: z.object({
      registryNumber: z.string().optional(),
      starsCategory: z.string().optional(),
      registryType: z.string().optional(),
      yearBuilt: z.coerce.number().optional(),
      roomCount: z.coerce.number().optional(),
      checkIn: z.string().optional(),
      checkOut: z.string().optional(),
      paymentMethod: z.string().optional(),
      smokingPolicy: z.string().optional(),
      hasInternet: z.string().optional(),
      parkingPolicy: z.string().optional(),
      diningPolicy: z.object({
        type: z.string().optional(),
        manual: z.object({
          breakfast: z.string().optional(),
          lunch: z.string().optional(),
          dinner: z.string().optional(),
        }).optional(),
      }).optional(),
      extraServices: z.object({
        cleaning: z.object({ type: z.string().optional(), price: z.number().optional() }).optional(),
        linen: z.object({ type: z.string().optional(), price: z.number().optional() }).optional(),
        hasReportingDocuments: z.boolean().optional(),
        hasTransfer: z.boolean().optional(),
      }).optional(),
    }).passthrough(),
    description: z.string().min(0).max(3000).optional().default(""),
    amenities: z.array(z.string()).optional(),
  }),
  // Шаг 3: Фотографии (валидация на наличие)
  3: z.object({
    photos: z.array(z.string()).min(0), // Минимум 5 проверим при публикации
  }),
}

export const roomSchema = z.object({
  title: z.string().min(1),
  type: z.string(),
  area: z.coerce.number().min(1),
  capacityAdults: z.coerce.number().min(1),
  capacityChildren: z.coerce.number().min(0),
  beds: z.array(z.object({ type: z.string(), count: z.number() })),
  amenities: z.array(z.string()),
  pricePerDay: z.coerce.number().min(0),
  priceLongTerm: z.coerce.number().optional(),
  instantBooking: z.boolean().default(false),
  quantity: z.coerce.number().min(1),
})

export const publishListingSchema = z.object({
  type: z.enum(['APARTMENT', 'HOUSE', 'ROOM', 'HOTEL_ROOM', 'PRIVATE_ROOM']),
  title: z.string().min(10).max(100),
  description: z.string().min(50).max(5000),
  city: z.string().min(2),
  streetName: z.string().min(1),
  houseNumber: z.string().min(1),
  pricePerDay: z.number().min(100),
})
