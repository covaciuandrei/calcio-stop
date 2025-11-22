import { Product } from '../products/product';
import { Seller } from './seller';

export interface ProductLink {
  id: string;
  productId: string;
  sellerId?: string; // Optional - links can be associated with a seller or standalone
  url: string;
  label?: string; // Optional label/name for the link
  createdAt: string; // ISO date string
  product?: Product | null; // full product object (fetched in same request)
  seller?: Seller | null; // full seller object (fetched in same request)
}
