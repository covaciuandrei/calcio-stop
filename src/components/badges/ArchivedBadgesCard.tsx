import React, { useMemo, useState } from 'react';
import { useArchivedBadges } from '../../stores';
import styles from '../shared/TableListCard.module.css';
import ArchivedBadges from './ArchivedBadges';

const ArchivedBadgesCard: React.FC = () => {
  // Get data from store
  const archivedBadges = useArchivedBadges();
  const [isArchivedBadgesExpanded, setIsArchivedBadgesExpanded] = useState(false);
  const [archivedBadgesSearchTerm, setArchivedBadgesSearchTerm] = useState('');
  
  // Sort archived badges alphabetically by name
  const sortedArchivedBadges = useMemo(() => {
    return [...archivedBadges].sort((a, b) => a.name.localeCompare(b.name));
  }, [archivedBadges]);

  return (
    <div className="card" style={{ marginTop: 'var(--space-5)' }}>
      {sortedArchivedBadges.length > 0 ? (
        <>
          <div
            className={`card-header mini-header mini-header-red ${styles.expandableHeader}`}
            onClick={() => setIsArchivedBadgesExpanded(!isArchivedBadgesExpanded)}
          >
            <span>Archived Badges ({sortedArchivedBadges.length})</span>
            <span className={`${styles.expandIcon} ${isArchivedBadgesExpanded ? styles.expanded : styles.collapsed}`}>
              ▼
            </span>
          </div>
          {!isArchivedBadgesExpanded && (
            <div className={styles.collapsedContent}>There are {sortedArchivedBadges.length} badges available.</div>
          )}
          {isArchivedBadgesExpanded && (
            <>
              <h3 className="card-section-header">Archived Badges List</h3>
              {sortedArchivedBadges.length >= 2 && (
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search archived badges..."
                    value={archivedBadgesSearchTerm}
                    onChange={(e) => setArchivedBadgesSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              )}
              <div className={styles.tableContainer}>
                <ArchivedBadges
                  archivedBadges={sortedArchivedBadges}
                  searchTerm={archivedBadgesSearchTerm}
                  onClearSearch={() => setArchivedBadgesSearchTerm('')}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="card-header mini-header mini-header-red">
            <span>Archived Badges (0)</span>
          </div>
          <div className={styles.emptyState}>No archived badges available.</div>
        </>
      )}
    </div>
  );
};

export default ArchivedBadgesCard;
