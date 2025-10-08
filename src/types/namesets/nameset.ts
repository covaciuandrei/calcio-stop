export interface Nameset {
  id: string;
  playerName: string; // e.g. "Messi"
  number: number; // e.g. 10
  season: string; // e.g. "2025/2026"
  quantity: number; // available quantity of this nameset
  kitTypeId: string; // reference to kit type (required, defaults to '1st Kit')
  createdAt: string; // ISO date string
}
