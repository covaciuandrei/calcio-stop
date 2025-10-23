import React, { useEffect } from 'react';
import {
  useBadgesActions,
  useKitTypesActions,
  useNamesetsActions,
  useProductsActions,
  useSalesActions,
  useTeamsActions,
} from '../../stores';
import { useAuthStore } from '../../stores/authStore';
import { AuthPage } from './AuthPage';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  // Get all the load actions from stores
  const { loadTeams, loadArchivedTeams } = useTeamsActions();
  const { loadBadges, loadArchivedBadges } = useBadgesActions();
  const { loadKitTypes, loadArchivedKitTypes } = useKitTypesActions();
  const { loadNamesets, loadArchivedNamesets } = useNamesetsActions();
  const { loadProducts, loadArchivedProducts } = useProductsActions();
  const { loadSales } = useSalesActions();

  useEffect(() => {
    // Initialize authentication state from localStorage
    initializeAuth();
  }, [initializeAuth]);

  // Load all data when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const loadAllData = async () => {
        try {
          // Load all data in parallel for better performance
          await Promise.all([
            loadTeams(),
            loadArchivedTeams(),
            loadBadges(),
            loadArchivedBadges(),
            loadKitTypes(),
            loadArchivedKitTypes(),
            loadNamesets(),
            loadArchivedNamesets(),
            loadProducts(),
            loadArchivedProducts(),
            loadSales(),
          ]);
          console.log('All data loaded successfully');
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };

      loadAllData();
    }
  }, [
    isAuthenticated,
    loadTeams,
    loadArchivedTeams,
    loadBadges,
    loadArchivedBadges,
    loadKitTypes,
    loadArchivedKitTypes,
    loadNamesets,
    loadArchivedNamesets,
    loadProducts,
    loadArchivedProducts,
    loadSales,
  ]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#666',
        }}
      >
        Loading...
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show protected content if authenticated
  return <>{children}</>;
};
