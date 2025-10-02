import React, { useState } from 'react';
import { useArchivedNamesets } from '../../stores';
import styles from '../shared/TableListCard.module.css';
import ArchivedNamesets from './ArchivedNamesets';

const ArchivedNamesetsCard: React.FC = () => {
  // Get data from store
  const archivedNamesets = useArchivedNamesets();
  const [isArchivedNamesetsExpanded, setIsArchivedNamesetsExpanded] = useState(false);
  const [archivedNamesetsSearchTerm, setArchivedNamesetsSearchTerm] = useState('');

  return (
    <div className="card" style={{ marginTop: 'var(--space-5)' }}>
      {archivedNamesets.length > 0 ? (
        <>
          <div
            className={`card-header mini-header mini-header-red ${styles.expandableHeader}`}
            onClick={() => setIsArchivedNamesetsExpanded(!isArchivedNamesetsExpanded)}
          >
            <span>Archived Namesets ({archivedNamesets.length})</span>
            <span className={`${styles.expandIcon} ${isArchivedNamesetsExpanded ? styles.expanded : styles.collapsed}`}>
              ▼
            </span>
          </div>
          {!isArchivedNamesetsExpanded && (
            <div className={styles.collapsedContent}>There are {archivedNamesets.length} namesets available.</div>
          )}
          {isArchivedNamesetsExpanded && (
            <>
              <h3 className="card-section-header">Archived Namesets List</h3>
              {archivedNamesets.length >= 2 && (
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search archived namesets..."
                    value={archivedNamesetsSearchTerm}
                    onChange={(e) => setArchivedNamesetsSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              )}
              <div className={styles.tableContainer}>
                <ArchivedNamesets
                  archivedNamesets={archivedNamesets}
                  searchTerm={archivedNamesetsSearchTerm}
                  onClearSearch={() => setArchivedNamesetsSearchTerm('')}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="card-header mini-header mini-header-red">
            <span>Archived Namesets (0)</span>
          </div>
          <div className={styles.emptyState}>No archived namesets available.</div>
        </>
      )}
    </div>
  );
};

export default ArchivedNamesetsCard;
