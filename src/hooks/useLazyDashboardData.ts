import { useState, useCallback, useMemo } from 'react';
import {
  useProductsList,
  useSalesList,
  useReturnsList,
  useNamesetsList,
  useTeamsList,
  useBadgesList,
  useKitTypesList,
  useLeaguesList,
  useReservationsList,
  useProductsActions,
  useSalesActions,
  useReturnsActions,
  useNamesetsActions,
  useTeamsActions,
  useBadgesActions,
  useKitTypesActions,
  useLeaguesActions,
  useReservationsActions,
} from '../stores';

type DashboardCardType =
  | 'products'
  | 'sales'
  | 'returns'
  | 'namesets'
  | 'teams'
  | 'badges'
  | 'kitTypes'
  | 'leagues'
  | 'reservations';

interface LazyDataState {
  loadedCards: Set<DashboardCardType>;
  loadingCards: Set<DashboardCardType>;
}

interface DashboardData {
  products: any[];
  sales: any[];
  returns: any[];
  namesets: any[];
  teams: any[];
  badges: any[];
  kitTypes: any[];
  leagues: any[];
  reservations: any[];
}

interface LoadingStates {
  products: boolean;
  sales: boolean;
  returns: boolean;
  namesets: boolean;
  teams: boolean;
  badges: boolean;
  kitTypes: boolean;
  leagues: boolean;
  reservations: boolean;
}

/**
 * Custom hook for lazy loading dashboard data based on card expansion state.
 * Only loads data when a card is first expanded, and caches it for subsequent expansions.
 */
export const useLazyDashboardData = () => {
  // Track which cards have been loaded and which are currently loading
  const [lazyState, setLazyState] = useState<LazyDataState>({
    loadedCards: new Set(),
    loadingCards: new Set(),
  });

  // Get all the data from stores (these will be empty until loaded)
  const products = useProductsList();
  const sales = useSalesList();
  const returns = useReturnsList();
  const namesets = useNamesetsList();
  const teams = useTeamsList();
  const badges = useBadgesList();
  const kitTypes = useKitTypesList();
  const leagues = useLeaguesList();
  const reservations = useReservationsList();

  const data: DashboardData = useMemo(() => ({
    products,
    sales,
    returns,
    namesets,
    teams,
    badges,
    kitTypes,
    leagues,
    reservations,
  }), [products, sales, returns, namesets, teams, badges, kitTypes, leagues, reservations]);

  // Get all load actions
  const {
    loadProducts,
    loadArchivedProducts,
  } = useProductsActions();
  const { loadSales } = useSalesActions();
  const { loadReturns } = useReturnsActions();
  const {
    loadNamesets,
    loadArchivedNamesets,
  } = useNamesetsActions();
  const {
    loadTeams,
    loadArchivedTeams,
  } = useTeamsActions();
  const {
    loadBadges,
    loadArchivedBadges,
  } = useBadgesActions();
  const {
    loadKitTypes,
    loadArchivedKitTypes,
  } = useKitTypesActions();
  const {
    loadLeagues,
    loadArchivedLeagues,
  } = useLeaguesActions();
  const { loadReservations } = useReservationsActions();

  // Create loading states based on lazy state
  const loadingStates: LoadingStates = {
    products: lazyState.loadingCards.has('products'),
    sales: lazyState.loadingCards.has('sales'),
    returns: lazyState.loadingCards.has('returns'),
    namesets: lazyState.loadingCards.has('namesets'),
    teams: lazyState.loadingCards.has('teams'),
    badges: lazyState.loadingCards.has('badges'),
    kitTypes: lazyState.loadingCards.has('kitTypes'),
    leagues: lazyState.loadingCards.has('leagues'),
    reservations: lazyState.loadingCards.has('reservations'),
  };

  // Function to load data for a specific card
  const loadCardData = useCallback(async (cardType: DashboardCardType) => {
    // Skip if already loaded or currently loading
    if (lazyState.loadedCards.has(cardType) || lazyState.loadingCards.has(cardType)) {
      return;
    }

    // Mark as loading
    setLazyState(prev => ({
      ...prev,
      loadingCards: new Set(prev.loadingCards).add(cardType),
    }));

    try {
      // Load the appropriate data based on card type
      switch (cardType) {
        case 'products':
          await Promise.all([
            loadProducts(),
            loadArchivedProducts(),
          ]);
          break;
        case 'sales':
          await loadSales();
          break;
        case 'returns':
          await loadReturns();
          break;
        case 'namesets':
          await Promise.all([
            loadNamesets(),
            loadArchivedNamesets(),
          ]);
          break;
        case 'teams':
          await Promise.all([
            loadTeams(),
            loadArchivedTeams(),
          ]);
          break;
        case 'badges':
          await Promise.all([
            loadBadges(),
            loadArchivedBadges(),
          ]);
          break;
        case 'kitTypes':
          await Promise.all([
            loadKitTypes(),
            loadArchivedKitTypes(),
          ]);
          break;
        case 'leagues':
          await Promise.all([
            loadLeagues(),
            loadArchivedLeagues(),
          ]);
          break;
        case 'reservations':
          await loadReservations();
          break;
      }

      // Mark as loaded
      setLazyState(prev => {
        const newLoadingCards = new Set(prev.loadingCards);
        newLoadingCards.delete(cardType);
        return {
          loadedCards: new Set(prev.loadedCards).add(cardType),
          loadingCards: newLoadingCards,
        };
      });
    } catch (error) {
      console.error(`Error loading ${cardType} data:`, error);
      // Remove from loading state on error
      setLazyState(prev => {
        const newLoadingCards = new Set(prev.loadingCards);
        newLoadingCards.delete(cardType);
        return {
          ...prev,
          loadingCards: newLoadingCards,
        };
      });
    }
  }, [
    lazyState.loadedCards,
    lazyState.loadingCards,
    loadProducts,
    loadArchivedProducts,
    loadSales,
    loadReturns,
    loadNamesets,
    loadArchivedNamesets,
    loadTeams,
    loadArchivedTeams,
    loadBadges,
    loadArchivedBadges,
    loadKitTypes,
    loadArchivedKitTypes,
    loadLeagues,
    loadArchivedLeagues,
    loadReservations,
  ]);

  // Function to check if a card's data is ready (loaded or has data)
  const isCardDataReady = useCallback((cardType: DashboardCardType): boolean => {
    // If it's loaded, it's ready
    if (lazyState.loadedCards.has(cardType)) {
      return true;
    }

    // Check if the data array has items (in case it was loaded by another route)
    const cardData = data[cardType];
    return Array.isArray(cardData) && cardData.length > 0;
  }, [lazyState.loadedCards, data]);

  return {
    data,
    loadingStates,
    loadCardData,
    isCardDataReady,
  };
};
