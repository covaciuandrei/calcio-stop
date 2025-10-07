import React, { useState } from 'react';
import { useNamesetsActions, useNamesetsList } from '../../stores';
import { Nameset } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditNamesetModal from './EditNamesetModal';
import NamesetTableList from './NamesetTableList';

const NamesetsTableListCard: React.FC = () => {
  // Get data and actions from stores
  const namesets = useNamesetsList();
  const { archiveNameset } = useNamesetsActions();
  const [editingNameset, setEditingNameset] = useState<Nameset | null>(null);
  const [isNamesetsExpanded, setIsNamesetsExpanded] = useState(true);
  const [namesetsSearchTerm, setNamesetsSearchTerm] = useState('');

  const handleArchive = (id: string) => {
    archiveNameset(id);
    setNamesetsSearchTerm(''); // Clear search after action
  };

  const handleEditClick = (n: Nameset) => {
    setEditingNameset(n);
  };

  return (
    <>
      <div className="card">
        {namesets.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-orange ${styles.expandableHeader}`}
              onClick={() => setIsNamesetsExpanded(!isNamesetsExpanded)}
            >
              <span>Active Namesets ({namesets.length})</span>
              <span className={`${styles.expandIcon} ${isNamesetsExpanded ? styles.expanded : styles.collapsed}`}>
                ▼
              </span>
            </div>
            {!isNamesetsExpanded && (
              <div className={styles.collapsedContent}>There are {namesets.length} namesets available.</div>
            )}
            {isNamesetsExpanded && (
              <>
                <h3 className="card-section-header">Active Namesets List</h3>
                {namesets.length >= 2 && (
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="Search namesets..."
                      value={namesetsSearchTerm}
                      onChange={(e) => setNamesetsSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                )}
                <div className={styles.tableContainer}>
                  <NamesetTableList
                    namesets={namesets}
                    onEdit={handleEditClick}
                    onArchive={handleArchive}
                    searchTerm={namesetsSearchTerm}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-orange">
              <span>Active Namesets (0)</span>
            </div>
            <div className={styles.emptyState}>No active namesets available.</div>
          </>
        )}
      </div>

      <EditNamesetModal editingNameset={editingNameset} setEditingNameset={setEditingNameset} />
    </>
  );
};

export default NamesetsTableListCard;
