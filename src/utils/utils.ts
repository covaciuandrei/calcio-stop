import { Nameset } from '../types/types';

export const generateSeasons = (start = 1990, end = 2030): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) => {
    const year = start + i;
    return `${year}/${year + 1}`; // string[]
  });

export const getNamesetInfo = (
  namesetId: string | null,
  namesets: Nameset[]
): { playerName: string; number: number; season: string } => {
  if (!namesetId) {
    return { playerName: '-', number: 0, season: '-' };
  }

  const nameset = namesets.find((n) => n.id === namesetId);
  if (!nameset) {
    return { playerName: '-', number: 0, season: '-' };
  }

  return {
    playerName: nameset.playerName,
    number: nameset.number,
    season: nameset.season,
  };
};
