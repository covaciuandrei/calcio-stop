import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  useBadgesActions,
  useKitTypesActions,
  useLeaguesActions,
  useNamesetsActions,
  useProductsActions,
  useTeamsActions,
} from '../../stores';

// Navigation items for public view (only products and badges)
const PUBLIC_NAVIGATION_ITEMS = {
  home: { label: 'Home', path: '/', end: true },
  products: { label: 'Products', path: '/products', end: false },
  badges: { label: 'Badges', path: '/badges', end: false },
};

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  // Get load actions for all data needed to display products properly
  const { loadBadges, loadArchivedBadges } = useBadgesActions();
  const { loadProducts, loadArchivedProducts } = useProductsActions();
  const { loadTeams, loadArchivedTeams } = useTeamsActions();
  const { loadNamesets, loadArchivedNamesets } = useNamesetsActions();
  const { loadKitTypes, loadArchivedKitTypes } = useKitTypesActions();
  const { loadLeagues, loadArchivedLeagues } = useLeaguesActions();

  // Load all data needed to display products properly when component mounts (no authentication required)
  useEffect(() => {
    const loadPublicData = async () => {
      try {
        // Load all data in parallel for better performance
        await Promise.all([
          loadBadges(),
          loadArchivedBadges(),
          loadProducts(),
          loadArchivedProducts(),
          loadTeams(),
          loadArchivedTeams(),
          loadNamesets(),
          loadArchivedNamesets(),
          loadKitTypes(),
          loadArchivedKitTypes(),
          loadLeagues(),
          loadArchivedLeagues(),
        ]);
      } catch (error) {
        console.error('Error loading public data:', error);
      }
    };

    loadPublicData();
  }, [
    loadBadges,
    loadArchivedBadges,
    loadProducts,
    loadArchivedProducts,
    loadTeams,
    loadArchivedTeams,
    loadNamesets,
    loadArchivedNamesets,
    loadKitTypes,
    loadArchivedKitTypes,
    loadLeagues,
    loadArchivedLeagues,
  ]);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Calcio Stop</h2>
        </div>
        <div className="navbar-nav">
          {Object.entries(PUBLIC_NAVIGATION_ITEMS).map(([key, item]) => (
            <NavLink key={key} to={item.path} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
};
