// src/types/booking.ts
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photoUrl: string;
  isOnline: boolean;
  rating: number;
  experienceYears: number;
  distanceKm: number;
  basePrice: number;
  currency: string;
}

export interface TimeSlot {
  time: string;
  status: 'available' | 'booked';
  period: 'morning' | 'afternoon' | 'evening';
}

export interface SessionType {
  id: string;
  label: string;
  description: string;
  locationLabel: string;
  price: number;
  colorScheme: 'blue' | 'purple';
}

export interface SessionDuration {
  minutes: string;
  label: string;
  sublabel: string;
  extraCost: number;
  colorScheme: 'blue' | 'purple';
}

export interface PaymentMethod {
  id: string;
  label: string;
  sublabel: string;
  bgColor: string;
}

export interface BookingConfig {
  sessionTypes: SessionType[];
  durations: SessionDuration[];
  paymentMethods: PaymentMethod[];
  specialRequirements: string[];
  platformFee: number;
  emergencyNumber: string;
  emergencyLabel: string;
}

export interface DayAvailability {
  date: number;
  available: boolean;
  faded?: boolean;
}

export interface Availability {
  month: number;
  year: number;
  days: DayAvailability[];
  slots: TimeSlot[];
}

export interface WalletBalance {
  amount: number;
  currency: string;
}

export interface PromoResult {
  valid: boolean;
  discountPercent?: number;
  discountAmount?: number;
  label?: string;
}

export interface BookingSummary {
  sessionFee: number;
  platformFee: number;
  promoDiscount: number;
  promoLabel: string;
  total: number;
  currency: string;
}