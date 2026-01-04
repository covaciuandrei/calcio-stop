import React, { useState } from 'react';
import { useAuth, useDashboardOrder } from '../stores';
import { useLazyDashboardData } from '../hooks/useLazyDashboardData';
import {
  LazyBadgesPage,
  LazyKitTypesPage,
  LazyLeaguesPage,
  LazyNamesetsPage,
  LazyProductsPage,
  LazyReservationsPage,
  LazyReturnsPage,
  LazySalesPage,
  LazyTeamsPage,
} from './Dashboard.lazy';
import CollapsibleHeader from './shared/CollapsibleHeader';
import styles from './shared/TableListCard.module.css';

const Dashboard: React.FC = () => {
  // Use lazy loading hook for data
  const { data, loadingStates, loadCardData, isCardDataReady } = useLazyDashboardData();
  const dashboardOrder = useDashboardOrder();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'admin' && isAuthenticated;

  // State for managing collapsed/expanded state of each card
  const [collapsedCards, setCollapsedCards] = useState({
    products: false,
    sales: false,
    returns: false,
    namesets: false,
    teams: false,
    badges: false,
    kitTypes: false,
    leagues: false,
    reservations: false,
  });

  const toggleCard = async (cardName: keyof typeof collapsedCards) => {
    const willBeExpanded = collapsedCards[cardName];

    setCollapsedCards((prev) => ({
      ...prev,
      [cardName]: !prev[cardName],
    }));

    // Load data when expanding a card for the first time
    if (willBeExpanded && !isCardDataReady(cardName as any)) {
      await loadCardData(cardName as any);
    }
  };

  // Dashboard cards configuration with lazy components
  const dashboardCards: {
    [key: string]: {
      title: string;
      description: string;
      count: number;
      component: React.ReactElement;
      adminOnly?: boolean;
      isLoading?: boolean;
    };
  } = {
    products: {
      title: 'Manage Products',
      description: 'Stock, prices, and inventory management',
      count: data.products.length,
      component: <LazyProductsPage />,
      isLoading: loadingStates.products,
    },
    sales: {
      title: 'Manage Sales',
      description: 'Track and record your sales transactions',
      count: data.sales.length,
      component: <LazySalesPage />,
      isLoading: loadingStates.sales,
    },
    returns: {
      title: 'Manage Returns',
      description: 'View and manage returned sales',
      count: data.returns.length,
      component: <LazyReturnsPage />,
      isLoading: loadingStates.returns,
    },
    namesets: {
      title: 'Manage Namesets',
      description: 'Customize team and player name collections',
      count: data.namesets.length,
      component: <LazyNamesetsPage />,
      isLoading: loadingStates.namesets,
    },
    teams: {
      title: 'Manage Teams',
      description: 'Organize your teams and player rosters',
      count: data.teams.length,
      component: <LazyTeamsPage />,
      isLoading: loadingStates.teams,
    },
    badges: {
      title: 'Manage Badges',
      description: 'Create and manage badges for shirts',
      count: data.badges.length,
      component: <LazyBadgesPage />,
      isLoading: loadingStates.badges,
    },
    kitTypes: {
      title: 'Manage Kit Types',
      description: 'Define kit types like 1st Kit, 2nd Kit, etc.',
      count: data.kitTypes.length,
      component: <LazyKitTypesPage />,
      isLoading: loadingStates.kitTypes,
    },
    leagues: {
      title: 'Manage Leagues',
      description: 'Manage championships and competitions',
      count: data.leagues.length,
      component: <LazyLeaguesPage />,
      isLoading: loadingStates.leagues,
    },
    reservations: {
      title: 'Manage Reservations',
      description: 'Track and manage product reservations',
      count: data.reservations.length,
      component: <LazyReservationsPage />,
      adminOnly: true,
      isLoading: loadingStates.reservations,
    },
  };

  return (
    <div>
      {dashboardOrder.map((cardId) => {
        const card = dashboardCards[cardId as keyof typeof dashboardCards];
        if (!card) return null;
        // Hide admin-only cards for non-admin users
        if (card.adminOnly && !isAdmin) return null;

        return (
          <div key={cardId} className="card">
            <CollapsibleHeader
              title={card.title}
              isExpanded={!collapsedCards[cardId as keyof typeof collapsedCards]}
              onToggle={() => toggleCard(cardId as keyof typeof collapsedCards)}
              count={card.count}
              isLoading={card.isLoading}
            />
            {collapsedCards[cardId as keyof typeof collapsedCards] && (
              <div className={styles.collapsedContent}>{card.description}</div>
            )}
            <div
              className={`${styles.collapsibleContent} ${collapsedCards[cardId as keyof typeof collapsedCards] ? styles.collapsed : ''}`}
            >
              {!collapsedCards[cardId as keyof typeof collapsedCards] && card.component}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
