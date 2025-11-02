export interface Team {
  id: string;
  name: string; // e.g. "Real Madrid", "Barcelona"
  leagues: string[]; // Array of league IDs
  createdAt: string; // ISO date string
}
