import { Badge, KitType, Nameset, Product, Team } from '../types';

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

export const getBadgeInfo = (badgeId: string | null, badges: Badge[], archivedBadges: Badge[] = []): string => {
  if (!badgeId) {
    return '-';
  }

  // First check in active badges
  let badge = badges.find((b) => b.id === badgeId);

  // If not found, check in archived badges
  if (!badge) {
    badge = archivedBadges.find((b) => b.id === badgeId);
  }

  if (!badge) {
    return '-';
  }

  return badge.name;
};

export const getProductInfo = (
  productId: string,
  products: Product[],
  archivedProducts: Product[] = []
): Product | null => {
  // First check in active products
  let product = products.find((p) => p.id === productId);

  // If not found, check in archived products
  if (!product) {
    product = archivedProducts.find((p) => p.id === productId);
  }

  return product || null;
};

export const getProductDisplayText = (
  product: {
    name: string;
    teamId: string | null;
    namesetId: string | null;
    badgeId: string | null;
    kitTypeId?: string;
  },
  namesets: Nameset[],
  archivedNamesets: Nameset[],
  teams: Team[],
  archivedTeams: Team[],
  badges: Badge[],
  archivedBadges: Badge[],
  kitTypes?: KitType[],
  archivedKitTypes?: KitType[]
): string => {
  const parts: string[] = [];

  // Team (if exists)
  if (product.teamId) {
    const teamName = getTeamInfo(product.teamId, teams, archivedTeams);
    if (teamName !== '-') {
      parts.push(teamName);
    }
  }

  // Product notes (if exists)
  if (product.name && product.name.trim()) {
    parts.push(product.name.trim());
  }

  // Kit Type (if exists)
  if (product.kitTypeId && kitTypes && archivedKitTypes) {
    const kitTypeName = getKitTypeInfo(product.kitTypeId, kitTypes, archivedKitTypes);
    if (kitTypeName !== '-') {
      parts.push(kitTypeName);
    }
  }

  // Nameset info (season, player, number)
  if (product.namesetId) {
    const namesetInfo = getNamesetInfo(product.namesetId, namesets, archivedNamesets);
    if (namesetInfo.playerName !== '-' || namesetInfo.season !== '-' || namesetInfo.number > 0) {
      const namesetParts: string[] = [];

      // Season (if exists)
      if (namesetInfo.season !== '-') {
        namesetParts.push(namesetInfo.season);
      }

      // Player and number (if exists)
      if (namesetInfo.playerName !== '-') {
        const playerPart =
          namesetInfo.number > 0 ? `${namesetInfo.playerName} #${namesetInfo.number}` : namesetInfo.playerName;
        namesetParts.push(playerPart);
      }

      if (namesetParts.length > 0) {
        parts.push(`(${namesetParts.join(' - ')})`);
      }
    }
  }

  // Badge (if exists)
  if (product.badgeId) {
    const badgeName = getBadgeInfo(product.badgeId, badges, archivedBadges);
    if (badgeName !== '-') {
      parts.push(badgeName);
    }
  }

  return parts.join(' - ');
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
