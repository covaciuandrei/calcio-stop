import { SaleType } from '../sales/sale';

export interface ReturnItem {
  productId: string;
  size: string; // which size was returned
  quantity: number;
  priceSold: number;
}

export interface Return {
  id: string;
  items: ReturnItem[]; // Array of products in this return
  customerName: string;
  date: string;
  saleType: SaleType;
  originalSaleId: string | null; // Reference to original sale if available
  createdAt: string; // ISO date string
}
