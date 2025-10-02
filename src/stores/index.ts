// Export all stores
export * from './authStore';
export * from './badgesStore';
export * from './counterStore';
export * from './namesetsStore';
export * from './productsStore';
export * from './salesStore';
export * from './teamsStore';
export * from './uiStore';

// Re-export commonly used hooks for convenience
export { useAuth, useAuthStatus, useAuthStore, useAuthUser } from './authStore';
export { useArchivedBadges, useBadges, useBadgesActions, useBadgesList, useBadgesStore } from './badgesStore';
export { useCounter, useCounterActions, useCounterConfig, useCounterStore, useCounterValue } from './counterStore';
export {
  useArchivedNamesets,
  useNamesets,
  useNamesetsActions,
  useNamesetsList,
  useNamesetsStore,
} from './namesetsStore';
export {
  useArchivedProducts,
  useProducts,
  useProductsActions,
  useProductsList,
  useProductsStore,
} from './productsStore';
export { useSales, useSalesActions, useSalesList, useSalesStore } from './salesStore';
export { useArchivedTeams, useTeams, useTeamsActions, useTeamsList, useTeamsStore } from './teamsStore';
export { useModal, useNotifications, useSidebar, useTheme, useUI, useUIStore } from './uiStore';

// Export selectors for advanced usage
export { authSelectors } from './authStore';
export { badgesSelectors } from './badgesStore';
export { counterSelectors } from './counterStore';
export { namesetsSelectors } from './namesetsStore';
export { productsSelectors } from './productsStore';
export { salesSelectors } from './salesStore';
export { teamsSelectors } from './teamsStore';
export { uiSelectors } from './uiStore';
