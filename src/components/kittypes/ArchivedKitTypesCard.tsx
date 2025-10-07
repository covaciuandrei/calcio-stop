import React, { useState } from 'react';
import { useArchivedKitTypes } from '../../stores';
import styles from '../shared/TableListCard.module.css';
import ArchivedKitTypes from './ArchivedKitTypes';

const ArchivedKitTypesCard: React.FC = () => {
  // Get data from store
  const archivedKitTypes = useArchivedKitTypes();
  const [isArchivedKitTypesExpanded, setIsArchivedKitTypesExpanded] = useState(false);
  const [archivedKitTypesSearchTerm, setArchivedKitTypesSearchTerm] = useState('');

  return (
    <div className="card" style={{ marginTop: 'var(--space-5)' }}>
      {archivedKitTypes.length > 0 ? (
        <>
          <div
            className={`card-header mini-header mini-header-red ${styles.expandableHeader}`}
            onClick={() => setIsArchivedKitTypesExpanded(!isArchivedKitTypesExpanded)}
          >
            <span>Archived Kit Types ({archivedKitTypes.length})</span>
            <span className={`${styles.expandIcon} ${isArchivedKitTypesExpanded ? styles.expanded : styles.collapsed}`}>
              ▼
            </span>
          </div>
          {!isArchivedKitTypesExpanded && (
            <div className={styles.collapsedContent}>There are {archivedKitTypes.length} kit types available.</div>
          )}
          {isArchivedKitTypesExpanded && (
            <>
              <h3 className="card-section-header">Archived Kit Types List</h3>
              {archivedKitTypes.length >= 2 && (
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search archived kit types..."
                    value={archivedKitTypesSearchTerm}
                    onChange={(e) => setArchivedKitTypesSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              )}
              <div className={styles.tableContainer}>
                <ArchivedKitTypes
                  archivedKitTypes={archivedKitTypes}
                  searchTerm={archivedKitTypesSearchTerm}
                  onClearSearch={() => setArchivedKitTypesSearchTerm('')}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="card-header mini-header mini-header-red">
            <span>Archived Kit Types (0)</span>
          </div>
          <div className={styles.emptyState}>No archived kit types available.</div>
        </>
      )}
    </div>
  );
};

export default ArchivedKitTypesCard;
