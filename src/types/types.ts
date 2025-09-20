export enum ProductType {
  SHIRT = "shirt",
  SHORTS = "shorts",
  KID_KIT = "kid kit",
  ADULT_KIT = "adult kit",
}

// size string unions
export type AdultSize = "S" | "M" | "L" | "XL" | "XXL";
export type KidSize = "22" | "24" | "26" | "28";

export interface ProductSizeQuantity {
  size: AdultSize | KidSize | string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  sizes: ProductSizeQuantity[]; // list of sizes + quantities
  season: string;
  playerName: string; // default "-"
  equipmentNumber: number; // positive only, 0 = unassigned
  price: number; // default price per unit
}

export interface Sale {
  id: string;
  productId: string;
  size: string;       // which size was sold
  quantity: number;
  priceSold: number;
  customerName: string;
  date: string;
}

export interface Nameset {
  id: string;
  playerName: string;   // e.g. "Messi"
  number: number;       // e.g. 10
  season: string;       // e.g. "2025/2026"
}