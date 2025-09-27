import React, { useState } from 'react';
import { Badge } from '../../types';
import styles from '../shared/TableListCard.module.css';
import ArchivedBadges from './ArchivedBadges';

interface Props {
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  archivedBadges: Badge[];
  setArchivedBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
}

const ArchivedBadgesCard: React.FC<Props> = ({ badges, setBadges, archivedBadges, setArchivedBadges }) => {
  const [isArchivedBadgesExpanded, setIsArchivedBadgesExpanded] = useState(false);
  const [archivedBadgesSearchTerm, setArchivedBadgesSearchTerm] = useState('');

  return (
    <div className="card" style={{ marginTop: 'var(--space-5)' }}>
      {archivedBadges.length > 0 ? (
        <>
          <div
            className={`card-header mini-header mini-header-red ${styles.expandableHeader}`}
            onClick={() => setIsArchivedBadgesExpanded(!isArchivedBadgesExpanded)}
          >
            <span>Archived Badges ({archivedBadges.length})</span>
            <span className={`${styles.expandIcon} ${isArchivedBadgesExpanded ? styles.expanded : styles.collapsed}`}>
              ▼
            </span>
          </div>
          {!isArchivedBadgesExpanded && (
            <div className={styles.collapsedContent}>There are {archivedBadges.length} badges available.</div>
          )}
          {isArchivedBadgesExpanded && (
            <>
              <h3 className="card-section-header">Archived Badges List</h3>
              {archivedBadges.length >= 2 && (
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
                  archivedBadges={archivedBadges}
                  setArchivedBadges={setArchivedBadges}
                  setBadges={setBadges}
                  searchTerm={archivedBadgesSearchTerm}
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
