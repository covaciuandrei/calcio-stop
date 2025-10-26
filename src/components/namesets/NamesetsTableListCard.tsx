import React, { useState } from 'react';
import { useNamesetsActions, useNamesetsList } from '../../stores';
import { Nameset } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditNamesetModal from './EditNamesetModal';
import NamesetTableList from './NamesetTableList';

interface NamesetsTableListCardProps {
  namesets?: Nameset[];
  isReadOnly?: boolean;
  showActions?: boolean;
  limit?: number;
}

const NamesetsTableListCard: React.FC<NamesetsTableListCardProps> = ({
  namesets: propNamesets,
  isReadOnly = false,
  showActions = true,
  limit,
}) => {
  // Get data and actions from stores
  const storeNamesets = useNamesetsList();
  const { archiveNameset } = useNamesetsActions();
  const [editingNameset, setEditingNameset] = useState<Nameset | null>(null);
  const [isNamesetsExpanded, setIsNamesetsExpanded] = useState(true);
  const [namesetsSearchTerm, setNamesetsSearchTerm] = useState('');

  // Use prop namesets if provided, otherwise use store namesets
  const namesets = propNamesets || storeNamesets;
  const displayNamesets = limit ? namesets.slice(0, limit) : namesets;

  const handleArchive = (id: string) => {
    if (!isReadOnly) {
      archiveNameset(id);
      setNamesetsSearchTerm(''); // Clear search after action
    }
  };

  const handleEditClick = (n: Nameset) => {
    if (!isReadOnly) {
      setEditingNameset(n);
    }
  };

  return (
    <>
      <div className="card">
        {displayNamesets.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-orange ${!isReadOnly ? styles.expandableHeader : ''}`}
              onClick={!isReadOnly ? () => setIsNamesetsExpanded(!isNamesetsExpanded) : undefined}
            >
              <span>
                Active Namesets ({displayNamesets.length}
                {limit ? ` (showing ${limit})` : ''})
              </span>
              {!isReadOnly && (
                <span className={`${styles.expandIcon} ${isNamesetsExpanded ? styles.expanded : styles.collapsed}`}>
                  ▼
                </span>
              )}
            </div>
            {!isReadOnly && !isNamesetsExpanded && (
              <div className={styles.collapsedContent}>There are {displayNamesets.length} namesets available.</div>
            )}
            {(isReadOnly || isNamesetsExpanded) && (
              <>
                <h3 className="card-section-header">Active Namesets List</h3>
                {displayNamesets.length >= 2 && !isReadOnly && (
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
                    namesets={displayNamesets}
                    onEdit={handleEditClick}
                    onArchive={handleArchive}
                    searchTerm={namesetsSearchTerm}
                    isReadOnly={isReadOnly}
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
