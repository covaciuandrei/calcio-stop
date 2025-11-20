import React, { useMemo, useState } from 'react';
import { useProductsList, useSellersList, useSuppliersActions } from '../../stores';
import { Seller } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditSellerModal from './EditSellerModal';
import SellersTableList from './SellersTableList';

interface SellersTableListCardProps {
  sellers?: Seller[];
  isReadOnly?: boolean;
  showActions?: boolean;
  limit?: number;
}

const SellersTableListCard: React.FC<SellersTableListCardProps> = ({
  sellers: propSellers,
  isReadOnly = false,
  showActions = true,
  limit,
}) => {
  // Get data and actions from stores
  const storeSellers = useSellersList();
  const products = useProductsList();
  const { archiveSeller } = useSuppliersActions();
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [isSellersExpanded, setIsSellersExpanded] = useState(true);
  const [sellersSearchTerm, setSellersSearchTerm] = useState('');

  // Use prop sellers if provided, otherwise use store sellers
  const sellers = propSellers || storeSellers;

  // Sort sellers alphabetically by name
  const sortedSellers = useMemo(() => {
    return [...sellers].sort((a, b) => a.name.localeCompare(b.name));
  }, [sellers]);

  const displaySellers = limit ? sortedSellers.slice(0, limit) : sortedSellers;

  const handleArchive = (id: string) => {
    if (!isReadOnly) {
      archiveSeller(id);
      setSellersSearchTerm('');
    }
  };

  const handleEditClick = (s: Seller) => {
    if (!isReadOnly) {
      setEditingSeller(s);
    }
  };

  return (
    <>
      <div className="card">
        {displaySellers.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-orange ${!isReadOnly ? styles.expandableHeader : ''}`}
              onClick={!isReadOnly ? () => setIsSellersExpanded(!isSellersExpanded) : undefined}
            >
              <span>
                Active Sellers ({displaySellers.length}
                {limit && sellers.length > limit ? ` (showing ${limit})` : ''})
              </span>
              {!isReadOnly && (
                <span className={`${styles.expandIcon} ${isSellersExpanded ? styles.expanded : styles.collapsed}`}>
                  ▼
                </span>
              )}
            </div>
            {!isReadOnly && !isSellersExpanded && (
              <div className={styles.collapsedContent}>There are {displaySellers.length} sellers available.</div>
            )}
            {(isReadOnly || isSellersExpanded) && (
              <>
                <h3 className="card-section-header">Sellers List</h3>
                {displaySellers.length >= 2 && !isReadOnly && (
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="Search sellers..."
                      value={sellersSearchTerm}
                      onChange={(e) => setSellersSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                )}
                <div className={styles.tableContainer}>
                  <SellersTableList
                    sellers={displaySellers}
                    onEdit={handleEditClick}
                    onArchive={handleArchive}
                    searchTerm={sellersSearchTerm}
                    isReadOnly={isReadOnly}
                    products={products}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-orange">
              <span>Active Sellers (0)</span>
            </div>
            <div className={styles.emptyState}>No active sellers available.</div>
          </>
        )}
      </div>

      <EditSellerModal editingSeller={editingSeller} setEditingSeller={setEditingSeller} />
    </>
  );
};

export default SellersTableListCard;
