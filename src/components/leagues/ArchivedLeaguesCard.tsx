import React, { useState } from 'react';
import { useArchivedLeagues } from '../../stores';
import styles from '../shared/TableListCard.module.css';
import ArchivedLeagues from './ArchivedLeagues';

const ArchivedLeaguesCard: React.FC = () => {
  // Get data from store
  const archivedLeagues = useArchivedLeagues();
  const [isArchivedLeaguesExpanded, setIsArchivedLeaguesExpanded] = useState(false);
  const [archivedLeaguesSearchTerm, setArchivedLeaguesSearchTerm] = useState('');

  return (
    <div className="card" style={{ marginTop: 'var(--space-5)' }}>
      {archivedLeagues.length > 0 ? (
        <>
          <div
            className={`card-header mini-header mini-header-red ${styles.expandableHeader}`}
            onClick={() => setIsArchivedLeaguesExpanded(!isArchivedLeaguesExpanded)}
          >
            <span>Archived Leagues ({archivedLeagues.length})</span>
            <span className={`${styles.expandIcon} ${isArchivedLeaguesExpanded ? styles.expanded : styles.collapsed}`}>
              ▼
            </span>
          </div>
          {!isArchivedLeaguesExpanded && (
            <div className={styles.collapsedContent}>There are {archivedLeagues.length} leagues available.</div>
          )}
          {isArchivedLeaguesExpanded && (
            <>
              <h3 className="card-section-header">Archived Leagues List</h3>
              {archivedLeagues.length >= 2 && (
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search archived leagues..."
                    value={archivedLeaguesSearchTerm}
                    onChange={(e) => setArchivedLeaguesSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              )}
              <div className={styles.tableContainer}>
                <ArchivedLeagues
                  archivedLeagues={archivedLeagues}
                  searchTerm={archivedLeaguesSearchTerm}
                  onClearSearch={() => setArchivedLeaguesSearchTerm('')}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="card-header mini-header mini-header-red">
            <span>Archived Leagues (0)</span>
          </div>
          <div className={styles.emptyState}>No archived leagues available.</div>
        </>
      )}
    </div>
  );
};

export default ArchivedLeaguesCard;

