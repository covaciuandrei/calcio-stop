export interface Badge {
  id: string;
  name: string; // e.g. "Champions League", "La Liga"
  season: string; // e.g. "2025/2026"
  quantity: number; // available quantity of this badge
  price: number; // price of the badge
  location?: string; // location where the badge is stored
  createdAt: string; // ISO date string
}

export interface BadgeImage {
  id: string;
  badgeId: string;
  imageUrl: string; // Legacy field, kept for backwards compatibility
  thumbnailUrl: string;
  mediumUrl: string;
  largeUrl: string;
  altText: string;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
}
