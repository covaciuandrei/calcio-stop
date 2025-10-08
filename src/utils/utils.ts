import { KitType, Nameset, Team } from '../types';

export const generateSeasons = (start = 1990, end = 2030): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) => {
    const year = start + i;
    return `${year}/${year + 1}`; // string[]
  });

export const getNamesetInfo = (
  namesetId: string | null,
  namesets: Nameset[],
  archivedNamesets: Nameset[] = []
): { playerName: string; number: number; season: string } => {
  if (!namesetId) {
    return { playerName: '-', number: 0, season: '-' };
  }

  // First check in active namesets
  let nameset = namesets.find((n) => n.id === namesetId);

  // If not found, check in archived namesets
  if (!nameset) {
    nameset = archivedNamesets.find((n) => n.id === namesetId);
  }

  if (!nameset) {
    return { playerName: '-', number: 0, season: '-' };
  }

  return {
    playerName: nameset.playerName,
    number: nameset.number,
    season: nameset.season,
  };
};

export const getTeamInfo = (teamId: string | null, teams: Team[], archivedTeams: Team[] = []): string => {
  if (!teamId) {
    return '-';
  }

  // First check in active teams
  let team = teams.find((t) => t.id === teamId);

  // If not found, check in archived teams
  if (!team) {
    team = archivedTeams.find((t) => t.id === teamId);
  }

  if (!team) {
    return '-';
  }

  return team.name;
};

export const getKitTypeInfo = (kitTypeId: string, kitTypes: KitType[], archivedKitTypes: KitType[] = []): string => {
  // First check in active kit types
  let kitType = kitTypes.find((kt) => kt.id === kitTypeId);

  // If not found, check in archived kit types
  if (!kitType) {
    kitType = archivedKitTypes.find((kt) => kt.id === kitTypeId);
  }

  if (!kitType) {
    return '-';
  }

  return kitType.name;
};

// Utility functions for sorting by creation date
// Usage examples:
// const sortedProducts = sortByCreatedAtDesc(products); // Newest first
// const sortedTeams = sortByCreatedAtAsc(teams); // Oldest first
export const sortByCreatedAt = <T extends { createdAt: string }>(items: T[], ascending: boolean = true): T[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const sortByCreatedAtDesc = <T extends { createdAt: string }>(items: T[]): T[] => {
  return sortByCreatedAt(items, false);
};

export const sortByCreatedAtAsc = <T extends { createdAt: string }>(items: T[]): T[] => {
  return sortByCreatedAt(items, true);
};
