export interface ProductLink {
  id: string;
  productId: string;
  sellerId?: string; // Optional - links can be associated with a seller or standalone
  url: string;
  label?: string; // Optional label/name for the link
  createdAt: string; // ISO date string
}
