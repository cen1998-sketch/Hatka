export type PropertyType = 'HOTEL_ROOM' | 'APARTMENT' | 'HOUSE' | 'PRIVATE_ROOM';
export type InternetAvailability = 'NONE' | 'FREE' | 'PAID';
export type ParkingAvailability = 'NONE' | 'FREE' | 'PAID';
export type PaymentMethodType = 'CASH_ONLY' | 'CARD_ONLY' | 'CASH_AND_CARD' | 'ANY';
export type SmokingPolicy = 'FORBIDDEN' | 'DESIGNATED_AREAS' | 'ALLOWED';
export type AdditionalServicePolicy = 'INCLUDED_IN_PRICE' | 'NOT_AVAILABLE' | 'AVAILABLE_FOR_FREE' | 'AVAILABLE_FOR_FEE';

export interface Property {
  id: string;
  ownerId?: string;
  
  // Тип и категория
  type: PropertyType;
  subType?: string;
  categoryId?: string;
  
  // Информация о здании/реестре
  title: string;
  registryNumber?: string;
  starRating?: number;
  registryType?: string;
  buildYear?: number;
  totalRooms?: number;
  
  // Локация
  city?: string;
  address: string;
  streetType?: string;
  streetName?: string;
  houseNumber?: string;
  buildingBlock?: string;
  landmarks?: string;
  
  // Характеристики
  description?: string;
  pricePerNight: number;
  pricePer15Days?: number;
  rooms: number;
  bedrooms: number;
  beds: number;
  doubleBeds: number;
  maxGuests: number;
  area?: number;
  
  // Правила
  checkIn?: string;
  checkOut?: string;
  smoking?: SmokingPolicy;
  paymentMethod?: PaymentMethodType;
  animals?: string;
  children: boolean;
  
  // Услуги и удобства
  internet?: InternetAvailability;
  parkingEnum?: ParkingAvailability;
  
  // Питание
  isAllInclusive: boolean;
  breakfastType?: string;
  lunchType?: string;
  dinnerType?: string;
  
  // Доп. услуги
  cleaningService?: AdditionalServicePolicy;
  bedLinen?: AdditionalServicePolicy;
  hasReportingDocs: boolean;
  hasTransfer: boolean;

  // Системные и legacy
  status?: "DRAFT" | "PENDING" | "ACTIVE" | "REJECTED" | "SOLD" | "ARCHIVED";
  image?: string;
  images?: { url: string; isPrimary: boolean }[] | string[];
  avgRating?: number;
  reviewsCount?: number;
  lastModified?: string;
  location?: string; // Legacy
  
  // Legacy fields (optional)
  wifi?: string;
  parking?: string;
  deposit?: string;
  moderationComment?: string;
}

export interface PropertyDraftState extends Partial<Property> {
  currentStep: number;
  isSaving: boolean;
  lastSavedAt: string | null;
}

export interface PropertyState {
  data: Property[];
  draft: PropertyDraftState;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
