import React, { useState } from 'react';
import { Team } from '../../types';
import styles from '../shared/TableListCard.module.css';
import ArchivedTeams from './ArchivedTeams';

interface Props {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  archivedTeams: Team[];
  setArchivedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const ArchivedTeamsCard: React.FC<Props> = ({ teams, setTeams, archivedTeams, setArchivedTeams }) => {
  const [isArchivedTeamsExpanded, setIsArchivedTeamsExpanded] = useState(false);
  const [archivedTeamsSearchTerm, setArchivedTeamsSearchTerm] = useState('');

  return (
    <div className="card" style={{ marginTop: 'var(--space-5)' }}>
      {archivedTeams.length > 0 ? (
        <>
          <div
            className={`card-header mini-header mini-header-red ${styles.expandableHeader}`}
            onClick={() => setIsArchivedTeamsExpanded(!isArchivedTeamsExpanded)}
          >
            <span>Archived Teams ({archivedTeams.length})</span>
            <span className={`${styles.expandIcon} ${isArchivedTeamsExpanded ? styles.expanded : styles.collapsed}`}>
              ▼
            </span>
          </div>
          {!isArchivedTeamsExpanded && (
            <div className={styles.collapsedContent}>There are {archivedTeams.length} teams available.</div>
          )}
          {isArchivedTeamsExpanded && (
            <>
              <h3 className="card-section-header">Archived Teams List</h3>
              {archivedTeams.length >= 2 && (
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
                  archivedTeams={archivedTeams}
                  setArchivedTeams={setArchivedTeams}
                  setTeams={setTeams}
                  searchTerm={archivedTeamsSearchTerm}
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
