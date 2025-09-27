import React, { useState } from 'react';
import { Nameset } from '../../types';
import styles from '../shared/TableListCard.module.css';
import ArchivedNamesets from './ArchivedNamesets';

interface Props {
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  archivedNamesets: Nameset[];
  setArchivedNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
}

const ArchivedNamesetsCard: React.FC<Props> = ({ namesets, setNamesets, archivedNamesets, setArchivedNamesets }) => {
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
                  setArchivedNamesets={setArchivedNamesets}
                  setNamesets={setNamesets}
                  searchTerm={archivedNamesetsSearchTerm}
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
