export interface Nameset {
  id: string;
  playerName: string; // e.g. "Messi"
  number: number; // e.g. 10
  season: string; // e.g. "2025/2026"
  quantity: number; // available quantity of this nameset
  price: number; // price of the nameset
  kitTypeId: string; // reference to kit type (required, defaults to '1st Kit')
  location?: string; // location where the nameset is stored
  createdAt: string; // ISO date string
}
