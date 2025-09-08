export enum ProductType {
  SHIRT = "shirt",
  SHORTS = "shorts",
  KID_KIT = "kid kit",
  ADULT_KIT = "adult kit",
}

export enum AdultSize {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

export enum KidSize {
  SIZE_22 = "22",
  SIZE_24 = "24",
  SIZE_26 = "26",
  SIZE_28 = "28",
}

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  size: AdultSize | KidSize | string;
  quantity: number;
  season: string;
  playerName: string; // default "-"
  equipmentNumber: number; // positive only
}


export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  date: string;
  priceSold: number;
  customerName: string;
}

