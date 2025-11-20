export interface Seller {
  id: string;
  name: string;
  websiteUrl?: string;
  specialNotes?: string; // Special notes about the seller
  productIds: string[]; // Array of product IDs that can be bought from this seller
  createdAt: string; // ISO date string
}
