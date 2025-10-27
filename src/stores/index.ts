// Export all stores
export * from './authStore';
export * from './badgesStore';
export * from './counterStore';
export * from './kitTypesStore';
export * from './namesetsStore';
export * from './productsStore';
export * from './salesStore';
export * from './settingsStore';
export * from './systemStore';
export * from './teamsStore';
export * from './uiStore';

// Re-export commonly used hooks for convenience
export { useAuth, useAuthStatus, useAuthStore, useAuthUser } from './authStore';
export {
  useArchivedBadges,
  useBadges,
  useBadgesActions,
  useBadgesList,
  useBadgesStore,
  useSoldOutBadges,
} from './badgesStore';
export { useCounter, useCounterActions, useCounterConfig, useCounterStore, useCounterValue } from './counterStore';
export {
  useArchivedKitTypes,
  useKitTypes,
  useKitTypesActions,
  useKitTypesList,
  useKitTypesStore,
} from './kitTypesStore';
export {
  useArchivedNamesets,
  useNamesets,
  useNamesetsActions,
  useNamesetsList,
  useNamesetsStore,
  useSoldOutNamesets,
} from './namesetsStore';
export {
  useArchivedProducts,
  useProducts,
  useProductsActions,
  useProductsList,
  useProductsStore,
  useSoldOutProducts,
} from './productsStore';
export { useSales, useSalesActions, useSalesList, useSalesStore } from './salesStore';
export { useAppBarOrder, useDashboardOrder, useSettings, useSettingsActions } from './settingsStore';
export { useArchivedTeams, useTeams, useTeamsActions, useTeamsList, useTeamsStore } from './teamsStore';
export {
  useArchivedBadgesSearch,
  useArchivedKitTypesSearch,
  useArchivedNamesetsSearch,
  useArchivedProductsSearch,
  useArchivedTeamsSearch,
  useBadgesSearch,
  useKitTypesSearch,
  useModal,
  useNamesetsSearch,
  useNotifications,
  useProductsSearch,
  useSalesSearch,
  useSearchActions,
  useSearchTerms,
  useSidebar,
  useTeamsSearch,
  useTheme,
  useUI,
  useUIStore,
} from './uiStore';

// Export selectors for advanced usage
export { authSelectors } from './authStore';
export { badgesSelectors } from './badgesStore';
export { counterSelectors } from './counterStore';
export { kitTypesSelectors } from './kitTypesStore';
export { namesetsSelectors } from './namesetsStore';
export { productsSelectors } from './productsStore';
export { salesSelectors } from './salesStore';
export { settingsSelectors } from './settingsStore';
export { teamsSelectors } from './teamsStore';
export { uiSelectors } from './uiStore';
