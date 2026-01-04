import { ProductFiltersState } from '../components/products/ProductFilters';
import { Product } from '../types';
import { getBadgeInfo, getKitTypeInfo, getNamesetInfo, getTeamInfo } from './utils';

export const applyProductFilters = (
  products: Product[],
  filters: ProductFiltersState,
  teams: any[],
  archivedTeams: any[],
  namesets: any[],
  archivedNamesets: any[],
  kitTypes: any[],
  archivedKitTypes: any[],
  badges: any[],
  archivedBadges: any[]
): Product[] => {
  return products.filter((product) => {
    // Team filter
    if (filters.team) {
      const teamInfo = getTeamInfo(product.teamId, teams, archivedTeams);
      if (!teamInfo.toLowerCase().includes(filters.team.toLowerCase())) {
        return false;
      }
    }

    // League filter - check if product's team belongs to any of the selected leagues
    if (filters.leagues.length > 0) {
      if (!product.teamId) {
        // Product has no team, so it doesn't belong to any league
        return false;
      }
      // Find the team (check both active and archived)
      let team = teams.find((t) => t.id === product.teamId);
      if (!team) {
        team = archivedTeams.find((t) => t.id === product.teamId);
      }
      if (!team) {
        // Team not found, can't verify league membership
        return false;
      }
      // Check if team's leagues array includes any of the selected league IDs
      const teamLeagues = team.leagues || [];
      const hasMatchingLeague = filters.leagues.some((leagueId) => teamLeagues.includes(leagueId));
      if (!hasMatchingLeague) {
        return false;
      }
    }

    // Type filter
    if (filters.type && product.type !== filters.type) {
      return false;
    }

    // Kit Type filter
    if (filters.kitType) {
      const kitTypeInfo = getKitTypeInfo(product.kitTypeId, kitTypes, archivedKitTypes);
      if (kitTypeInfo !== filters.kitType) {
        return false;
      }
    }

    // Sizes filter - only show products that have stock for the selected sizes
    if (filters.sizes.length > 0) {
      const hasStockForSelectedSizes = filters.sizes.some((selectedSize) => {
        const sizeData = product.sizes.find((s) => s.size === selectedSize);
        return sizeData && sizeData.quantity > 0;
      });
      if (!hasStockForSelectedSizes) {
        return false;
      }
    }

    // Season filter
    if (filters.season) {
      const namesetInfo = getNamesetInfo(product.namesetId, namesets, archivedNamesets);
      if (namesetInfo.season !== filters.season) {
        return false;
      }
    }

    // Player filter
    if (filters.player) {
      const namesetInfo = getNamesetInfo(product.namesetId, namesets, archivedNamesets);
      if (!namesetInfo.playerName.toLowerCase().includes(filters.player.toLowerCase())) {
        return false;
      }
    }

    // Number filter
    if (filters.number) {
      const namesetInfo = getNamesetInfo(product.namesetId, namesets, archivedNamesets);
      const productNumber = namesetInfo.number.toString();
      if (productNumber !== filters.number) {
        return false;
      }
    }

    // Badge filter
    if (filters.badge) {
      const badgeInfo = getBadgeInfo(product.badgeId, badges, archivedBadges);
      if (badgeInfo !== filters.badge) {
        return false;
      }
    }

    // Price range filter
    if (filters.priceMin) {
      const minPrice = parseFloat(filters.priceMin);
      if (isNaN(minPrice) || product.price < minPrice) {
        return false;
      }
    }

    if (filters.priceMax) {
      const maxPrice = parseFloat(filters.priceMax);
      if (isNaN(maxPrice) || product.price > maxPrice) {
        return false;
      }
    }

    // On Sale filter
    if (filters.onSale) {
      // When checkbox is checked, show only on-sale products
      if (!product.isOnSale) {
        return false;
      }
    }
    // When checkbox is unchecked (false), show all products (no filtering)

    // Total quantity range filter
    if (filters.totalMin || filters.totalMax) {
      const totalQuantity = product.sizes.reduce((sum, sq) => sum + sq.quantity, 0);

      if (filters.totalMin) {
        const minTotal = parseFloat(filters.totalMin);
        if (isNaN(minTotal) || totalQuantity < minTotal) {
          return false;
        }
      }

      if (filters.totalMax) {
        const maxTotal = parseFloat(filters.totalMax);
        if (isNaN(maxTotal) || totalQuantity > maxTotal) {
          return false;
        }
      }
    }

    return true;
  });
};

export const getActiveFiltersCount = (filters: ProductFiltersState): number => {
  let count = 0;

  if (filters.team) count++;
  if (filters.type) count++;
  if (filters.kitType) count++;
  if (filters.sizes.length > 0) count++;
  if (filters.season) count++;
  if (filters.player) count++;
  if (filters.number) count++;
  if (filters.badge) count++;
  if (filters.leagues.length > 0) count++;
  if (filters.priceMin) count++;
  if (filters.priceMax) count++;
  if (filters.totalMin) count++;
  if (filters.totalMax) count++;

  return count;
};
