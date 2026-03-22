export interface Property {
  id: string;
  image?: string;
  images?: string[];
  title: string;
  description?: string;
  price?: string;
  pricePerNight?: number;
  basePrice?: number;
  rating?: string;
  reviews?: string;
  location?: string;
  city?: string;
  address?: string;
  landmarks?: string;
  
  // Новые поля
  status?: "DRAFT" | "PENDING" | "ACTIVE" | "REJECTED" | "SOLD" | "ARCHIVED";
  propertyType?: string;
  lastModified?: string;
  
  checkIn?: string;
  checkOut?: string;
  smoking?: string;
  animals?: string;
  children?: boolean;
  wifi?: string;
  parking?: string;
  paymentMethods?: string[];
  deposit?: string;
  moderationComment?: string;

  specs?: {
    guests: string;
    beds: string;
    area: string;
  };
  
  categoryId?: string;
  ownerId?: string;
}

export interface PropertyState {
  data: Property[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
