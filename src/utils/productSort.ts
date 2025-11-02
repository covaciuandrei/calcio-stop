import { Product } from '../types';
import { getProductDisplayText } from './utils';
import { Nameset, Team, Badge, KitType } from '../types';

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | '';

export const sortProducts = (
  products: Product[],
  sortOption: SortOption,
  namesets: Nameset[],
  archivedNamesets: Nameset[],
  teams: Team[],
  archivedTeams: Team[],
  badges: Badge[],
  archivedBadges: Badge[],
  kitTypes?: KitType[],
  archivedKitTypes?: KitType[]
): Product[] => {
  if (!sortOption) {
    return products;
  }

  const sorted = [...products];

  switch (sortOption) {
    case 'name-asc':
      sorted.sort((a, b) => {
        const nameA = getProductDisplayText(a, namesets, archivedNamesets, teams, archivedTeams, badges, archivedBadges, kitTypes, archivedKitTypes).toLowerCase();
        const nameB = getProductDisplayText(b, namesets, archivedNamesets, teams, archivedTeams, badges, archivedBadges, kitTypes, archivedKitTypes).toLowerCase();
        return nameA.localeCompare(nameB);
      });
      break;

    case 'name-desc':
      sorted.sort((a, b) => {
        const nameA = getProductDisplayText(a, namesets, archivedNamesets, teams, archivedTeams, badges, archivedBadges, kitTypes, archivedKitTypes).toLowerCase();
        const nameB = getProductDisplayText(b, namesets, archivedNamesets, teams, archivedTeams, badges, archivedBadges, kitTypes, archivedKitTypes).toLowerCase();
        return nameB.localeCompare(nameA);
      });
      break;

    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;

    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;

    default:
      break;
  }

  return sorted;
};

