import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useBadgesActions,
  useBadgesStore,
  useKitTypesActions,
  useKitTypesStore,
  useLeaguesActions,
  useLeaguesStore,
  useNamesetsActions,
  useNamesetsStore,
  useProductsActions,
  useProductsStore,
  useSalesActions,
  useSuppliersActions,
  useSuppliersStore,
  useTeamsActions,
  useTeamsStore,
} from '../stores';

/**
 * Shared state across all hook instances to prevent duplicate requests
 * This ensures that even if multiple components call useRouteData,
 * only one request per route is made
 */
const globalRouteState = {
  hasLoaded: new Set<string>(),
  loadingPaths: new Set<string>(),
};

/**
 * Hook to load data based on the current route.
 * Only loads the data necessary for the current page.
 */
export const useRouteData = () => {
  const location = useLocation();

  // Get all load actions at the top level (hooks must be called at top level)
  const { loadTeams, loadArchivedTeams } = useTeamsActions();
  const { loadBadges, loadArchivedBadges } = useBadgesActions();
  const { loadKitTypes, loadArchivedKitTypes } = useKitTypesActions();
  const { loadLeagues, loadArchivedLeagues } = useLeaguesActions();
  const { loadNamesets, loadArchivedNamesets } = useNamesetsActions();
  const { loadProducts, loadArchivedProducts } = useProductsActions();
  const { loadSales } = useSalesActions();
  const { loadSellers, loadArchivedSellers, loadProductLinks } = useSuppliersActions();

  // Store actions in ref to prevent re-renders when they change
  const loadActionsRef = useRef({
    loadTeams,
    loadArchivedTeams,
    loadBadges,
    loadArchivedBadges,
    loadKitTypes,
    loadArchivedKitTypes,
    loadLeagues,
    loadArchivedLeagues,
    loadNamesets,
    loadArchivedNamesets,
    loadProducts,
    loadArchivedProducts,
    loadSales,
    loadSellers,
    loadArchivedSellers,
    loadProductLinks,
  });

  // Update ref when actions change
  useEffect(() => {
    loadActionsRef.current = {
      loadTeams,
      loadArchivedTeams,
      loadBadges,
      loadArchivedBadges,
      loadKitTypes,
      loadArchivedKitTypes,
      loadLeagues,
      loadArchivedLeagues,
      loadNamesets,
      loadArchivedNamesets,
      loadProducts,
      loadArchivedProducts,
      loadSales,
      loadSellers,
      loadArchivedSellers,
      loadProductLinks,
    };
  }, [
    loadTeams,
    loadArchivedTeams,
    loadBadges,
    loadArchivedBadges,
    loadKitTypes,
    loadArchivedKitTypes,
    loadLeagues,
    loadArchivedLeagues,
    loadNamesets,
    loadArchivedNamesets,
    loadProducts,
    loadArchivedProducts,
    loadSales,
    loadSellers,
    loadArchivedSellers,
    loadProductLinks,
  ]);

  useEffect(() => {
    const path = location.pathname;

    // Normalize path: remove /admin prefix for route matching
    // This allows the same route logic to work for both /products and /admin/products
    const normalizedPath = path.startsWith('/admin') ? path.replace('/admin', '') || '/' : path;

    // Skip if we already loaded data for this route (using global state)
    if (globalRouteState.hasLoaded.has(path)) {
      return;
    }

    // Skip if this specific path is already being loaded (prevents duplicate requests)
    if (globalRouteState.loadingPaths.has(path)) {
      return;
    }

    // Mark this path as loading IMMEDIATELY to prevent concurrent loads (using global state)
    globalRouteState.loadingPaths.add(path);

    // Helper to check if data is already loaded
    const isDataLoaded = (store: any, key: string) => {
      const state = store.getState();
      return state[key]?.length > 0;
    };

    // Helper to add load promises to array only if data is not already loaded
    const addLoadIfNeeded = (
      loadPromises: Promise<void>[],
      loadFn: () => Promise<void>,
      loadArchivedFn: () => Promise<void> | undefined,
      store: any,
      key: string,
      archivedKey?: string
    ) => {
      if (!isDataLoaded(store, key)) {
        loadPromises.push(loadFn());
      }

      if (archivedKey && loadArchivedFn && !isDataLoaded(store, archivedKey)) {
        const archivedPromise = loadArchivedFn();
        if (archivedPromise) {
          loadPromises.push(archivedPromise);
        }
      }
    };

    const loadRouteData = async () => {
      try {
        const loadPromises: Promise<void>[] = [];
        const actions = loadActionsRef.current;

        // Products page needs: products, teams, namesets, kit types, badges, leagues
        if (normalizedPath.startsWith('/products')) {
          addLoadIfNeeded(
            loadPromises,
            actions.loadProducts,
            actions.loadArchivedProducts,
            useProductsStore,
            'products',
            'archivedProducts'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadTeams,
            actions.loadArchivedTeams,
            useTeamsStore,
            'teams',
            'archivedTeams'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadNamesets,
            actions.loadArchivedNamesets,
            useNamesetsStore,
            'namesets',
            'archivedNamesets'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadKitTypes,
            actions.loadArchivedKitTypes,
            useKitTypesStore,
            'kitTypes',
            'archivedKitTypes'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadBadges,
            actions.loadArchivedBadges,
            useBadgesStore,
            'badges',
            'archivedBadges'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadLeagues,
            actions.loadArchivedLeagues,
            useLeaguesStore,
            'leagues',
            'archivedLeagues'
          );
        }
        // Sales page needs: products (for product picker), teams, namesets, kit types, badges (for display)
        else if (normalizedPath.startsWith('/sales')) {
          addLoadIfNeeded(
            loadPromises,
            actions.loadProducts,
            actions.loadArchivedProducts,
            useProductsStore,
            'products',
            'archivedProducts'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadTeams,
            actions.loadArchivedTeams,
            useTeamsStore,
            'teams',
            'archivedTeams'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadNamesets,
            actions.loadArchivedNamesets,
            useNamesetsStore,
            'namesets',
            'archivedNamesets'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadKitTypes,
            actions.loadArchivedKitTypes,
            useKitTypesStore,
            'kitTypes',
            'archivedKitTypes'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadBadges,
            actions.loadArchivedBadges,
            useBadgesStore,
            'badges',
            'archivedBadges'
          );
          // Sales are loaded separately with date filters, so we don't load them here
        }
        // Badges page needs: badges
        else if (normalizedPath.startsWith('/badges')) {
          addLoadIfNeeded(
            loadPromises,
            actions.loadBadges,
            actions.loadArchivedBadges,
            useBadgesStore,
            'badges',
            'archivedBadges'
          );
        }
        // Teams page needs: teams and leagues (teams page includes leagues management)
        else if (normalizedPath.startsWith('/teams')) {
          addLoadIfNeeded(
            loadPromises,
            actions.loadTeams,
            actions.loadArchivedTeams,
            useTeamsStore,
            'teams',
            'archivedTeams'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadLeagues,
            actions.loadArchivedLeagues,
            useLeaguesStore,
            'leagues',
            'archivedLeagues'
          );
        }
        // Namesets page needs: namesets, teams, kit types
        else if (normalizedPath.startsWith('/namesets')) {
          addLoadIfNeeded(
            loadPromises,
            actions.loadNamesets,
            actions.loadArchivedNamesets,
            useNamesetsStore,
            'namesets',
            'archivedNamesets'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadTeams,
            actions.loadArchivedTeams,
            useTeamsStore,
            'teams',
            'archivedTeams'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadKitTypes,
            actions.loadArchivedKitTypes,
            useKitTypesStore,
            'kitTypes',
            'archivedKitTypes'
          );
        }
        // Kit Types page needs: kit types
        else if (normalizedPath.startsWith('/kittypes')) {
          addLoadIfNeeded(
            loadPromises,
            actions.loadKitTypes,
            actions.loadArchivedKitTypes,
            useKitTypesStore,
            'kitTypes',
            'archivedKitTypes'
          );
        }
        // Leagues page needs: leagues
        else if (normalizedPath.startsWith('/leagues')) {
          addLoadIfNeeded(
            loadPromises,
            actions.loadLeagues,
            actions.loadArchivedLeagues,
            useLeaguesStore,
            'leagues',
            'archivedLeagues'
          );
        }
        // Suppliers page needs: sellers, product links, products (for product links)
        else if (normalizedPath.startsWith('/suppliers')) {
          addLoadIfNeeded(
            loadPromises,
            actions.loadSellers,
            actions.loadArchivedSellers,
            useSuppliersStore,
            'sellers',
            'archivedSellers'
          );
          if (actions.loadProductLinks && !isDataLoaded(useSuppliersStore, 'productLinks')) {
            loadPromises.push(actions.loadProductLinks());
          }
          // Products needed for product links
          addLoadIfNeeded(
            loadPromises,
            actions.loadProducts,
            actions.loadArchivedProducts,
            useProductsStore,
            'products',
            'archivedProducts'
          );
        }
        // Reservations page needs: products (for product picker), teams, namesets, kit types, badges (for display)
        else if (normalizedPath.startsWith('/reservations')) {
          addLoadIfNeeded(
            loadPromises,
            actions.loadProducts,
            actions.loadArchivedProducts,
            useProductsStore,
            'products',
            'archivedProducts'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadTeams,
            actions.loadArchivedTeams,
            useTeamsStore,
            'teams',
            'archivedTeams'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadNamesets,
            actions.loadArchivedNamesets,
            useNamesetsStore,
            'namesets',
            'archivedNamesets'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadKitTypes,
            actions.loadArchivedKitTypes,
            useKitTypesStore,
            'kitTypes',
            'archivedKitTypes'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadBadges,
            actions.loadArchivedBadges,
            useBadgesStore,
            'badges',
            'archivedBadges'
          );
        }
        // Dashboard needs everything (it shows all pages)
        else if (normalizedPath === '/' || normalizedPath === '/dashboard') {
          addLoadIfNeeded(
            loadPromises,
            actions.loadProducts,
            actions.loadArchivedProducts,
            useProductsStore,
            'products',
            'archivedProducts'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadTeams,
            actions.loadArchivedTeams,
            useTeamsStore,
            'teams',
            'archivedTeams'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadNamesets,
            actions.loadArchivedNamesets,
            useNamesetsStore,
            'namesets',
            'archivedNamesets'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadKitTypes,
            actions.loadArchivedKitTypes,
            useKitTypesStore,
            'kitTypes',
            'archivedKitTypes'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadBadges,
            actions.loadArchivedBadges,
            useBadgesStore,
            'badges',
            'archivedBadges'
          );
          addLoadIfNeeded(
            loadPromises,
            actions.loadLeagues,
            actions.loadArchivedLeagues,
            useLeaguesStore,
            'leagues',
            'archivedLeagues'
          );
        }

        await Promise.all(loadPromises);
        globalRouteState.hasLoaded.add(path);
      } catch (error) {
        console.error('Error loading route data:', error);
        // Remove from loaded set on error so it can retry
        globalRouteState.hasLoaded.delete(path);
      } finally {
        // Always remove from loading set when done
        globalRouteState.loadingPaths.delete(path);
      }
    };

    loadRouteData();
  }, [location.pathname]);
};
