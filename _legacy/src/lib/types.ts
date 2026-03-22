import { PropertyCardProps } from "@/components/ui/property-card";

export type UserRole = "tenant" | "landlord";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  bookedIds: string[]; // IDs of properties the user has booked
  likedIds: string[];  // IDs of properties the user has liked
  listingIds: string[]; // IDs of properties the user has created (as landlord)
  telegramConnected: boolean;
  joinedDate: string;
}

export interface Property extends PropertyCardProps {
  id: string;
  lat: number;
  lng: number;
  basePrice?: number;
}

export interface HostInfo {
  name: string;
  avatar: string;
  lastSeen: string;
  languages: string[];
  responseTime: string;
  joinedDate: string;
}

export interface Review {
  userName: string;
  avatarColor: string;
  avatarLetter: string;
  date: string;
  stayDuration: string;
  pros: string;
  cons: string;
  timeAgo: string;
  hostReply?: {
    text: string;
    timeAgo: string;
  };
}

export interface AmenityGroup {
  title: string;
  items: string[];
}

export interface SleepingPlace {
  type: "double-bed" | "sofa-bed" | "single-bed";
  title: string;
  count: number;
}

export interface PropertyDetail extends Property {
  images: string[];
  tags: string[];
  description: string;
  host: HostInfo;
  sleepingPlaces: {
    summary: string;
    items: SleepingPlace[];
  };
  amenities: {
    main: string[];
    groups: AmenityGroup[];
  };
  rules: {
    checkIn: string;
    checkOut: string;
    summary: string;
    items: {
      icon: string;
      text: string;
    }[];
  };
  detailedReviews: {
    rating: string;
    count: number;
    items: Review[];
  };
  cancelationPolicy: {
    title: string;
    deadline: string;
    description: string;
  };
  
  // Dashboard & Database fields
  status?: "active" | "pending" | "draft";
  lastModified?: string;
  propertyType?: string; // e.g., "Гостиница", "Отель"
  addressDetails?: {
    streetType: string;
    streetName: string;
    house: string;
    building?: string;
    city: string;
  };
  registryNumber?: string;
  stars?: number;
  infrastructure?: {
    internet: "Paid" | "Free" | "No";
    parking: "Paid" | "Free" | "No";
    yearBuilt?: number;
    roomCount?: number;
    paymentMethods?: string[]; // ["Cash", "Card"]
    smokingPolicy?: string;
  };
  additionalServices?: {
    cleaning?: string;
    bedding?: string;
    shuttle?: boolean;
    reports?: boolean;
  };
}
