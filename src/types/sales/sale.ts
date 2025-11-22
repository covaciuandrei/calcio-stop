import { Product } from '../products/product';

export type SaleType = 'OLX' | 'IN-PERSON';

export interface SaleItem {
  productId: string;
  size: string; // which size was sold
  quantity: number;
  priceSold: number;
  product?: Product | null; // full product object (fetched in same request)
}

export interface Sale {
  id: string;
  items: SaleItem[]; // Array of products in this sale
  customerName: string;
  date: string;
  saleType: SaleType;
  createdAt: string; // ISO date string
}
