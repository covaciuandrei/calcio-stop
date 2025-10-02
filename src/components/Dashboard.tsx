import React, { useState } from 'react';
import { useBadgesList, useNamesetsList, useProductsList, useSalesList, useTeamsList } from '../stores';
import BadgesPage from './badges/BadgesPage';
import NamesetsPage from './namesets/NamesetsPage';
import ProductsPage from './products/ProductsPage';
import SalesPage from './sales/SalesPage';
import CollapsibleHeader from './shared/CollapsibleHeader';
import styles from './shared/TableListCard.module.css';
import TeamsPage from './teams/TeamsPage';

const Dashboard: React.FC = () => {
  // Get data from stores
  const products = useProductsList();
  const sales = useSalesList();
  const namesets = useNamesetsList();
  const teams = useTeamsList();
  const badges = useBadgesList();
  // State for managing collapsed/expanded state of each card
  const [collapsedCards, setCollapsedCards] = useState({
    products: false,
    sales: false,
    namesets: false,
    teams: false,
    badges: false,
  });

  const toggleCard = (cardName: keyof typeof collapsedCards) => {
    setCollapsedCards((prev) => ({
      ...prev,
      [cardName]: !prev[cardName],
    }));
  };

  return (
    <div>
      {/* Manage Products */}
      <div className="card">
        <CollapsibleHeader
          title="Manage Products"
          isExpanded={!collapsedCards.products}
          onToggle={() => toggleCard('products')}
          count={products.length}
        />
        {collapsedCards.products && (
          <div className={styles.collapsedContent}>Stock, prices, and inventory management</div>
        )}
        <div className={`${styles.collapsibleContent} ${collapsedCards.products ? styles.collapsed : ''}`}>
          <ProductsPage />
        </div>
      </div>

      {/* Manage Sales */}
      <div className="card">
        <CollapsibleHeader
          title="Manage Sales"
          isExpanded={!collapsedCards.sales}
          onToggle={() => toggleCard('sales')}
          count={sales.length}
        />
        {collapsedCards.sales && (
          <div className={styles.collapsedContent}>Track and record your sales transactions</div>
        )}
        <div className={`${styles.collapsibleContent} ${collapsedCards.sales ? styles.collapsed : ''}`}>
          <SalesPage />
        </div>
      </div>

      {/* Manage Namesets */}
      <div className="card">
        <CollapsibleHeader
          title="Manage Namesets"
          isExpanded={!collapsedCards.namesets}
          onToggle={() => toggleCard('namesets')}
          count={namesets.length}
        />
        {collapsedCards.namesets && (
          <div className={styles.collapsedContent}>Customize team and player name collections</div>
        )}
        <div className={`${styles.collapsibleContent} ${collapsedCards.namesets ? styles.collapsed : ''}`}>
          <NamesetsPage />
        </div>
      </div>

      {/* Manage Teams */}
      <div className="card">
        <CollapsibleHeader
          title="Manage Teams"
          isExpanded={!collapsedCards.teams}
          onToggle={() => toggleCard('teams')}
          count={teams.length}
        />
        {collapsedCards.teams && <div className={styles.collapsedContent}>Organize your teams and player rosters</div>}
        <div className={`${styles.collapsibleContent} ${collapsedCards.teams ? styles.collapsed : ''}`}>
          <TeamsPage />
        </div>
      </div>

      {/* Manage Badges */}
      <div className="card">
        <CollapsibleHeader
          title="Manage Badges"
          isExpanded={!collapsedCards.badges}
          onToggle={() => toggleCard('badges')}
          count={badges.length}
        />
        {collapsedCards.badges && <div className={styles.collapsedContent}>Create and manage badges for shirts</div>}
        <div className={`${styles.collapsibleContent} ${collapsedCards.badges ? styles.collapsed : ''}`}>
          <BadgesPage />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
