import { PropertyCardProps } from "@/components/ui/property-card";

export interface Property extends PropertyCardProps {
  id: string;
  lat: number;
  lng: number;
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
  description: string;
  tags: string[];
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
  price: string;
  basePrice: number;
  cancelationPolicy: {
    title: string;
    deadline: string;
    description: string;
  };
}
