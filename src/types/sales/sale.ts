export interface Sale {
  id: string;
  productId: string;
  size: string; // which size was sold
  quantity: number;
  priceSold: number;
  customerName: string;
  date: string;
}
