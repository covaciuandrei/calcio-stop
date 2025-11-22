import React, { useState } from 'react';
import { useRouteData } from '../hooks/useRouteData';
import {
  useAuth,
  useBadgesList,
  useDashboardOrder,
  useKitTypesList,
  useLeaguesList,
  useNamesetsList,
  useProductsList,
  useReservationsList,
  useReturnsList,
  useSalesList,
  useTeamsList,
} from '../stores';
import BadgesPage from './badges/BadgesPage';
import KitTypesPage from './kittypes/KitTypesPage';
import LeaguesPage from './leagues/LeaguesPage';
import NamesetsPage from './namesets/NamesetsPage';
import ProductsPage from './products/ProductsPage';
import ReservationsPage from './reservations/ReservationsPage';
import ReturnsPage from './returns/ReturnsPage';
import SalesPage from './sales/SalesPage';
import CollapsibleHeader from './shared/CollapsibleHeader';
import styles from './shared/TableListCard.module.css';
import TeamsPage from './teams/TeamsPage';

const Dashboard: React.FC = () => {
  // Load all data needed for dashboard (it shows all pages)
  useRouteData();
  // Get data from stores
  const products = useProductsList();
  const sales = useSalesList();
  const returns = useReturnsList();
  const namesets = useNamesetsList();
  const teams = useTeamsList();
  const badges = useBadgesList();
  const kitTypes = useKitTypesList();
  const leagues = useLeaguesList();
  const reservations = useReservationsList();
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

  const toggleCard = (cardName: keyof typeof collapsedCards) => {
    setCollapsedCards((prev) => ({
      ...prev,
      [cardName]: !prev[cardName],
    }));
  };

  // Dashboard cards configuration
  const dashboardCards: {
    [key: string]: {
      title: string;
      description: string;
      count: number;
      component: React.ReactElement;
      adminOnly?: boolean;
    };
  } = {
    products: {
      title: 'Manage Products',
      description: 'Stock, prices, and inventory management',
      count: products.length,
      component: <ProductsPage />,
    },
    sales: {
      title: 'Manage Sales',
      description: 'Track and record your sales transactions',
      count: sales.length,
      component: <SalesPage />,
    },
    returns: {
      title: 'Manage Returns',
      description: 'View and manage returned sales',
      count: returns.length,
      component: <ReturnsPage />,
    },
    namesets: {
      title: 'Manage Namesets',
      description: 'Customize team and player name collections',
      count: namesets.length,
      component: <NamesetsPage />,
    },
    teams: {
      title: 'Manage Teams',
      description: 'Organize your teams and player rosters',
      count: teams.length,
      component: <TeamsPage />,
    },
    badges: {
      title: 'Manage Badges',
      description: 'Create and manage badges for shirts',
      count: badges.length,
      component: <BadgesPage />,
    },
    kitTypes: {
      title: 'Manage Kit Types',
      description: 'Define kit types like 1st Kit, 2nd Kit, etc.',
      count: kitTypes.length,
      component: <KitTypesPage />,
    },
    leagues: {
      title: 'Manage Leagues',
      description: 'Manage championships and competitions',
      count: leagues.length,
      component: <LeaguesPage />,
    },
    reservations: {
      title: 'Manage Reservations',
      description: 'Track and manage product reservations',
      count: reservations.length,
      component: <ReservationsPage />,
      adminOnly: true,
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
            />
            {collapsedCards[cardId as keyof typeof collapsedCards] && (
              <div className={styles.collapsedContent}>{card.description}</div>
            )}
            <div
              className={`${styles.collapsibleContent} ${collapsedCards[cardId as keyof typeof collapsedCards] ? styles.collapsed : ''}`}
            >
              {card.component}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
