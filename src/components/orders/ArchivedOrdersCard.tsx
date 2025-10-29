import React, { useState } from 'react';
import { useArchivedOrders } from '../../stores';
import styles from '../shared/TableListCard.module.css';
import ArchivedOrders from './ArchivedOrders';

const ArchivedOrdersCard: React.FC = () => {
  // Get data from store
  const archivedOrders = useArchivedOrders();
  const [isArchivedOrdersExpanded, setIsArchivedOrdersExpanded] = useState(false);
  const [archivedOrdersSearchTerm, setArchivedOrdersSearchTerm] = useState('');

  return (
    <div className="card" style={{ marginTop: 'var(--space-5)' }}>
      {archivedOrders.length > 0 ? (
        <>
          <div
            className={`card-header mini-header mini-header-red ${styles.expandableHeader}`}
            onClick={() => setIsArchivedOrdersExpanded(!isArchivedOrdersExpanded)}
          >
            <span>Archived Orders ({archivedOrders.length})</span>
            <span className={`${styles.expandIcon} ${isArchivedOrdersExpanded ? styles.expanded : styles.collapsed}`}>
              ▼
            </span>
          </div>
          {!isArchivedOrdersExpanded && (
            <div className={styles.collapsedContent}>There are {archivedOrders.length} archived orders available.</div>
          )}
          <div className={`${styles.collapsibleContent} ${!isArchivedOrdersExpanded ? styles.collapsed : ''}`}>
            {isArchivedOrdersExpanded && (
              <>
                <h3 className="card-section-header">Archived Orders List</h3>
                {archivedOrders.length >= 2 && (
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="Search archived orders..."
                      value={archivedOrdersSearchTerm}
                      onChange={(e) => setArchivedOrdersSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                )}
                <div className={styles.tableContainer}>
                  <ArchivedOrders
                    archivedOrders={archivedOrders}
                    searchTerm={archivedOrdersSearchTerm}
                    onClearSearch={() => setArchivedOrdersSearchTerm('')}
                  />
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="card-header mini-header mini-header-red">
            <span>Archived Orders (0)</span>
          </div>
          <div className={styles.emptyState}>No archived orders available.</div>
        </>
      )}
    </div>
  );
};

export default ArchivedOrdersCard;
