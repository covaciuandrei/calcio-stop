import React, { useMemo, useState } from 'react';
import { useArchivedSellers, useProductsList, useSuppliersActions } from '../../stores';
import styles from '../shared/TableListCard.module.css';
import SellersTableList from './SellersTableList';

const ArchivedSellersCard: React.FC = () => {
  // Get data from store
  const archivedSellers = useArchivedSellers();
  const products = useProductsList();
  const { restoreSeller } = useSuppliersActions();
  const [isArchivedSellersExpanded, setIsArchivedSellersExpanded] = useState(false);
  const [archivedSellersSearchTerm, setArchivedSellersSearchTerm] = useState('');

  // Sort archived sellers alphabetically by name
  const sortedArchivedSellers = useMemo(() => {
    return [...archivedSellers].sort((a, b) => a.name.localeCompare(b.name));
  }, [archivedSellers]);

  const handleRestore = (id: string) => {
    restoreSeller(id);
    setArchivedSellersSearchTerm('');
  };

  return (
    <div className="card" style={{ marginTop: 'var(--space-5)' }}>
      {sortedArchivedSellers.length > 0 ? (
        <>
          <div
            className={`card-header mini-header mini-header-red ${styles.expandableHeader}`}
            onClick={() => setIsArchivedSellersExpanded(!isArchivedSellersExpanded)}
          >
            <span>Archived Sellers ({sortedArchivedSellers.length})</span>
            <span className={`${styles.expandIcon} ${isArchivedSellersExpanded ? styles.expanded : styles.collapsed}`}>
              ▼
            </span>
          </div>
          {!isArchivedSellersExpanded && (
            <div className={styles.collapsedContent}>There are {sortedArchivedSellers.length} sellers available.</div>
          )}
          {isArchivedSellersExpanded && (
            <>
              <h3 className="card-section-header">Archived Sellers List</h3>
              {sortedArchivedSellers.length >= 2 && (
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search archived sellers..."
                    value={archivedSellersSearchTerm}
                    onChange={(e) => setArchivedSellersSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              )}
              <div className={styles.tableContainer}>
                <SellersTableList
                  sellers={sortedArchivedSellers}
                  onEdit={() => {}} // Archived items can't be edited
                  onArchive={handleRestore}
                  searchTerm={archivedSellersSearchTerm}
                  isReadOnly={false}
                  products={products}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="card-header mini-header mini-header-red">
            <span>Archived Sellers (0)</span>
          </div>
          <div className={styles.emptyState}>No archived sellers available.</div>
        </>
      )}
    </div>
  );
};

export default ArchivedSellersCard;
