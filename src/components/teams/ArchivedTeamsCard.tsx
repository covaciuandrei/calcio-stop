import React, { useMemo, useState } from 'react';
import { useArchivedTeams } from '../../stores';
import styles from '../shared/TableListCard.module.css';
import ArchivedTeams from './ArchivedTeams';

const ArchivedTeamsCard: React.FC = () => {
  // Get data from store
  const archivedTeams = useArchivedTeams();
  const [isArchivedTeamsExpanded, setIsArchivedTeamsExpanded] = useState(false);
  const [archivedTeamsSearchTerm, setArchivedTeamsSearchTerm] = useState('');
  
  // Sort archived teams alphabetically by name
  const sortedArchivedTeams = useMemo(() => {
    return [...archivedTeams].sort((a, b) => a.name.localeCompare(b.name));
  }, [archivedTeams]);

  return (
    <div className="card" style={{ marginTop: 'var(--space-5)' }}>
      {sortedArchivedTeams.length > 0 ? (
        <>
          <div
            className={`card-header mini-header mini-header-red ${styles.expandableHeader}`}
            onClick={() => setIsArchivedTeamsExpanded(!isArchivedTeamsExpanded)}
          >
            <span>Archived Teams ({sortedArchivedTeams.length})</span>
            <span className={`${styles.expandIcon} ${isArchivedTeamsExpanded ? styles.expanded : styles.collapsed}`}>
              ▼
            </span>
          </div>
          {!isArchivedTeamsExpanded && (
            <div className={styles.collapsedContent}>There are {sortedArchivedTeams.length} teams available.</div>
          )}
          {isArchivedTeamsExpanded && (
            <>
              <h3 className="card-section-header">Archived Teams List</h3>
              {sortedArchivedTeams.length >= 2 && (
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search archived teams..."
                    value={archivedTeamsSearchTerm}
                    onChange={(e) => setArchivedTeamsSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              )}
              <div className={styles.tableContainer}>
                <ArchivedTeams
                  archivedTeams={sortedArchivedTeams}
                  searchTerm={archivedTeamsSearchTerm}
                  onClearSearch={() => setArchivedTeamsSearchTerm('')}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="card-header mini-header mini-header-red">
            <span>Archived Teams (0)</span>
          </div>
          <div className={styles.emptyState}>No archived teams available.</div>
        </>
      )}
    </div>
  );
};

export default ArchivedTeamsCard;
