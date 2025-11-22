// Export all stores
export * from './authStore';
export * from './badgesStore';
export * from './kitTypesStore';
export * from './leaguesStore';
export * from './namesetsStore';
export * from './ordersStore';
export * from './productsStore';
export * from './reservationsStore';
export * from './returnsStore';
export * from './salesStore';
export * from './settingsStore';
export * from './suppliersStore';
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
export {
  useArchivedKitTypes,
  useKitTypes,
  useKitTypesActions,
  useKitTypesList,
  useKitTypesStore,
} from './kitTypesStore';
export { useArchivedLeagues, useLeagues, useLeaguesActions, useLeaguesList, useLeaguesStore } from './leaguesStore';
export {
  useArchivedNamesets,
  useNamesets,
  useNamesetsActions,
  useNamesetsList,
  useNamesetsStore,
  useSoldOutNamesets,
} from './namesetsStore';
export { useArchivedOrders, useOrdersActions, useOrdersList, useOrdersStore } from './ordersStore';
export {
  useAllProducts,
  useArchivedProducts,
  useProducts,
  useProductsActions,
  useProductsList,
  useProductsStore,
  useSoldOutProducts,
} from './productsStore';
export {
  useReservations,
  useReservationsActions,
  useReservationsList,
  useReservationsStore,
} from './reservationsStore';
export { useReturns, useReturnsActions, useReturnsFilters, useReturnsList, useReturnsStore } from './returnsStore';
export { useSales, useSalesActions, useSalesFilters, useSalesList, useSalesStore } from './salesStore';
export { useAppBarOrder, useDashboardOrder, useSettings, useSettingsActions } from './settingsStore';
export {
  useArchivedSellers,
  useProductLinksList,
  useSellersList,
  useSuppliers,
  useSuppliersActions,
} from './suppliersStore';
export { useArchivedTeams, useTeams, useTeamsActions, useTeamsList, useTeamsStore } from './teamsStore';
export {
  useArchivedBadgesSearch,
  useArchivedKitTypesSearch,
  useArchivedLeaguesSearch,
  useArchivedNamesetsSearch,
  useArchivedProductsSearch,
  useArchivedTeamsSearch,
  useBadgesSearch,
  useKitTypesSearch,
  useLeaguesSearch,
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
export { kitTypesSelectors } from './kitTypesStore';
export { leaguesSelectors } from './leaguesStore';
export { namesetsSelectors } from './namesetsStore';
export { productsSelectors } from './productsStore';
export { reservationsSelectors } from './reservationsStore';
export { returnsSelectors } from './returnsStore';
export { salesSelectors } from './salesStore';
export { settingsSelectors } from './settingsStore';
export { suppliersSelectors } from './suppliersStore';
export { teamsSelectors } from './teamsStore';
export { uiSelectors } from './uiStore';
