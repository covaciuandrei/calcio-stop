export interface ReservationItem {
  productId: string;
  size: string;
  quantity: number;
  priceSold: number;
}

export type ReservationStatus = 'pending' | 'completed';
export type ReservationSaleType = 'OLX' | 'IN-PERSON' | 'VINTED';

export interface Reservation {
  id: string;
  items: ReservationItem[];
  customerName: string;
  expiringDate: string; // ISO date string
  status: ReservationStatus;
  saleType: ReservationSaleType;
  createdAt: string; // ISO date string
  completedAt?: string; // ISO date string (only when completed)
}
