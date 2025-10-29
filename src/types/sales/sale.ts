export type SaleType = 'OLX' | 'IN-PERSON';

export interface Sale {
  id: string;
  productId: string;
  size: string; // which size was sold
  quantity: number;
  priceSold: number;
  customerName: string;
  date: string;
  saleType: SaleType;
  createdAt: string; // ISO date string
}
