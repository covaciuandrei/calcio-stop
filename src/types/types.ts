export enum ProductType {
  SHIRT = 'shirt',
  SHORTS = 'shorts',
  KID_KIT = 'kid kit',
  ADULT_KIT = 'adult kit',
}

// size string unions
export type AdultSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type KidSize = '22' | '24' | '26' | '28';

export interface ProductSizeQuantity {
  size: AdultSize | KidSize | string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  sizes: ProductSizeQuantity[]; // list of sizes + quantities
  namesetId: string | null; // reference to nameset, null if no nameset
  teamId: string | null; // reference to team, null if no team
  price: number; // default price per unit
}

export interface Sale {
  id: string;
  productId: string;
  size: string; // which size was sold
  quantity: number;
  priceSold: number;
  customerName: string;
  date: string;
}

export interface Nameset {
  id: string;
  playerName: string; // e.g. "Messi"
  number: number; // e.g. 10
  season: string; // e.g. "2025/2026"
  quantity: number; // available quantity of this nameset
}

export interface Team {
  id: string;
  name: string; // e.g. "Real Madrid", "Barcelona"
}

export interface Badge {
  id: string;
  name: string; // e.g. "Champions League", "La Liga"
  season: string; // e.g. "2025/2026"
  quantity: number; // available quantity of this badge
}
