import { Product } from '../types';
import { getBadgeInfo, getKitTypeInfo, getNamesetInfo, getTeamInfo } from './utils';

/**
 * Formats a product into a simple name string (no stock, price, or detailed info)
 */
export const formatProductForExport = (
  product: Product,
  teams: any[],
  archivedTeams: any[],
  namesets: any[],
  archivedNamesets: any[],
  kitTypes: any[],
  archivedKitTypes: any[],
  badges: any[],
  archivedBadges: any[]
): string => {
  const parts: string[] = [];

  // Team
  if (product.teamId) {
    const teamName = getTeamInfo(product.teamId, teams, archivedTeams);
    if (teamName !== '-') {
      parts.push(teamName);
    }
  }

  // Product name/notes
  if (product.name && product.name.trim()) {
    parts.push(product.name.trim());
  }

  // Kit Type
  if (product.kitTypeId) {
    const kitTypeName = getKitTypeInfo(product.kitTypeId, kitTypes, archivedKitTypes);
    if (kitTypeName !== '-') {
      parts.push(kitTypeName);
    }
  }

  // Player name and number only (no season)
  if (product.namesetId) {
    const namesetInfo = getNamesetInfo(product.namesetId, namesets, archivedNamesets);
    if (namesetInfo.playerName !== '-') {
      const playerPart =
        namesetInfo.number > 0 ? `${namesetInfo.playerName} #${namesetInfo.number}` : namesetInfo.playerName;
      parts.push(playerPart);
    }
  }

  // Badge
  if (product.badgeId) {
    const badgeName = getBadgeInfo(product.badgeId, badges, archivedBadges);
    if (badgeName !== '-') {
      parts.push(badgeName);
    }
  }

  // Type
  parts.push(product.type);

  return parts.join(' - ');
};

/**
 * Exports products to a text file
 */
export const exportProductsToText = (
  products: Product[],
  teams: any[],
  archivedTeams: any[],
  namesets: any[],
  archivedNamesets: any[],
  kitTypes: any[],
  archivedKitTypes: any[],
  badges: any[],
  archivedBadges: any[]
): void => {
  if (products.length === 0) {
    alert('No products to export');
    return;
  }

  // Format each product
  const lines = products.map((product) =>
    formatProductForExport(
      product,
      teams,
      archivedTeams,
      namesets,
      archivedNamesets,
      kitTypes,
      archivedKitTypes,
      badges,
      archivedBadges
    )
  );

  // Create text content (one product per line)
  const content = lines.join('\n');

  // Create blob and download
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `products-export-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
