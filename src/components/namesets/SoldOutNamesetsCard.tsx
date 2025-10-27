import React, { useMemo, useState } from 'react';
import { useNamesetsActions, useSoldOutNamesets } from '../../stores';
import { Nameset } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditNamesetModal from './EditNamesetModal';
import NamesetTableList from './NamesetTableList';

interface SoldOutNamesetsCardProps {
  isReadOnly?: boolean;
  showActions?: boolean;
  limit?: number;
}

const SoldOutNamesetsCard: React.FC<SoldOutNamesetsCardProps> = ({ isReadOnly = false, showActions = true, limit }) => {
  // Get data and actions from stores
  const allNamesets = useSoldOutNamesets();

  // Memoize the sold-out namesets filtering to prevent infinite re-renders
  const soldOutNamesets = useMemo(() => allNamesets.filter((n) => n.quantity === 0), [allNamesets]);
  const { archiveNameset } = useNamesetsActions();

  const [editingNameset, setEditingNameset] = useState<Nameset | null>(null);
  const [isSoldOutExpanded, setIsSoldOutExpanded] = useState(true);
  const [soldOutSearchTerm, setSoldOutSearchTerm] = useState('');

  const displaySoldOutNamesets = limit ? soldOutNamesets.slice(0, limit) : soldOutNamesets;

  const deleteNameset = (id: string) => {
    if (!isReadOnly) {
      archiveNameset(id);
      setSoldOutSearchTerm(''); // Clear search after action
    }
  };

  const handleEditClick = (nameset: Nameset) => {
    if (!isReadOnly) {
      setEditingNameset(nameset);
    }
  };

  return (
    <>
      <div className="card" style={{ marginTop: 'var(--space-5)' }}>
        {soldOutNamesets.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-red ${!isReadOnly ? styles.expandableHeader : ''}`}
              onClick={!isReadOnly ? () => setIsSoldOutExpanded(!isSoldOutExpanded) : undefined}
            >
              <span>
                SOLD OUT Namesets ({displaySoldOutNamesets.length}
                {limit && soldOutNamesets.length > limit ? ` (showing ${limit})` : ''}
                {displaySoldOutNamesets.length !== soldOutNamesets.length ? ` of ${soldOutNamesets.length}` : ''})
              </span>
              {!isReadOnly && (
                <span className={`${styles.expandIcon} ${isSoldOutExpanded ? styles.expanded : styles.collapsed}`}>
                  ▼
                </span>
              )}
            </div>
            {!isReadOnly && !isSoldOutExpanded && (
              <div className={styles.collapsedContent}>
                There are {displaySoldOutNamesets.length} sold out namesets
                {displaySoldOutNamesets.length !== soldOutNamesets.length ? ` (${soldOutNamesets.length} total)` : ''}.
              </div>
            )}
            <div className={`${styles.collapsibleContent} ${!isSoldOutExpanded ? styles.collapsed : ''}`}>
              {isSoldOutExpanded && (
                <>
                  <h3 className="card-section-header">Sold Out Namesets List</h3>
                  {displaySoldOutNamesets.length >= 2 && (
                    <div className={styles.searchContainer}>
                      <input
                        type="text"
                        placeholder="Search sold out namesets..."
                        value={soldOutSearchTerm}
                        onChange={(e) => setSoldOutSearchTerm(e.target.value)}
                        className={styles.searchInput}
                      />
                    </div>
                  )}
                  <div className={styles.tableContainer}>
                    <NamesetTableList
                      namesets={displaySoldOutNamesets}
                      onEdit={handleEditClick}
                      onArchive={deleteNameset}
                      searchTerm={soldOutSearchTerm}
                      isReadOnly={isReadOnly}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-red">
              <span>SOLD OUT Namesets (0)</span>
            </div>
            <div className={styles.emptyState}>No sold out namesets available.</div>
          </>
        )}
      </div>

      <EditNamesetModal editingNameset={editingNameset} setEditingNameset={setEditingNameset} />
    </>
  );
};

export default SoldOutNamesetsCard;
