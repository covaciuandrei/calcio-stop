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

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  sizes: ProductSizeQuantity[]; // list of sizes + quantities
  namesetId: string | null; // reference to nameset, null if no nameset
  teamId: string | null; // reference to team, null if no team
  kitTypeId: string; // reference to kit type (required, defaults to '1st Kit')
  badgeId: string | null; // reference to badge, null if no badge
  price: number; // default price per unit
  olxLink?: string; // OLX listing URL
  location?: string; // location where the product is stored
  createdAt: string; // ISO date string
  images?: ProductImage[]; // product images
}
