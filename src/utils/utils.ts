import { Badge, Nameset, Team } from '../types/types';

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

export const getBadgeInfo = (
  badgeId: string | null,
  badges: Badge[],
  archivedBadges: Badge[] = []
): { name: string; season: string; quantity: number } => {
  if (!badgeId) {
    return { name: '-', season: '-', quantity: 0 };
  }

  // First check in active badges
  let badge = badges.find((b) => b.id === badgeId);

  // If not found, check in archived badges
  if (!badge) {
    badge = archivedBadges.find((b) => b.id === badgeId);
  }

  if (!badge) {
    return { name: 'Unknown badge', season: '-', quantity: 0 };
  }

  return {
    name: badge.name,
    season: badge.season,
    quantity: badge.quantity,
  };
};
