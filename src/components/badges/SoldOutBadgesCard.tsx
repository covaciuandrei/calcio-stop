import React, { useMemo, useState } from 'react';
import { useBadgesActions, useSoldOutBadges } from '../../stores';
import { Badge } from '../../types';
import styles from '../shared/TableListCard.module.css';
import BadgeTableList from './BadgeTableList';
import EditBadgeModal from './EditBadgeModal';

interface SoldOutBadgesCardProps {
  isReadOnly?: boolean;
  showActions?: boolean;
  limit?: number;
}

const SoldOutBadgesCard: React.FC<SoldOutBadgesCardProps> = ({ isReadOnly = false, showActions = true, limit }) => {
  // Get data and actions from stores
  const allBadges = useSoldOutBadges();

  // Memoize the sold-out badges filtering to prevent infinite re-renders
  const soldOutBadges = useMemo(() => allBadges.filter((b) => b.quantity === 0), [allBadges]);
  const { archiveBadge } = useBadgesActions();

  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [isSoldOutExpanded, setIsSoldOutExpanded] = useState(true);
  const [soldOutSearchTerm, setSoldOutSearchTerm] = useState('');

  const displaySoldOutBadges = limit ? soldOutBadges.slice(0, limit) : soldOutBadges;

  const deleteBadge = (id: string) => {
    if (!isReadOnly) {
      archiveBadge(id);
      setSoldOutSearchTerm(''); // Clear search after action
    }
  };

  const handleEditClick = (badge: Badge) => {
    if (!isReadOnly) {
      setEditingBadge(badge);
    }
  };

  return (
    <>
      <div className="card" style={{ marginTop: 'var(--space-5)' }}>
        {soldOutBadges.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-red ${!isReadOnly ? styles.expandableHeader : ''}`}
              onClick={!isReadOnly ? () => setIsSoldOutExpanded(!isSoldOutExpanded) : undefined}
            >
              <span>
                SOLD OUT Badges ({displaySoldOutBadges.length}
                {limit && soldOutBadges.length > limit ? ` (showing ${limit})` : ''}
                {displaySoldOutBadges.length !== soldOutBadges.length ? ` of ${soldOutBadges.length}` : ''})
              </span>
              {!isReadOnly && (
                <span className={`${styles.expandIcon} ${isSoldOutExpanded ? styles.expanded : styles.collapsed}`}>
                  ▼
                </span>
              )}
            </div>
            {!isReadOnly && !isSoldOutExpanded && (
              <div className={styles.collapsedContent}>
                There are {displaySoldOutBadges.length} sold out badges
                {displaySoldOutBadges.length !== soldOutBadges.length ? ` (${soldOutBadges.length} total)` : ''}.
              </div>
            )}
            <div className={`${styles.collapsibleContent} ${!isSoldOutExpanded ? styles.collapsed : ''}`}>
              {isSoldOutExpanded && (
                <>
                  <h3 className="card-section-header">Sold Out Badges List</h3>
                  {displaySoldOutBadges.length >= 2 && (
                    <div className={styles.searchContainer}>
                      <input
                        type="text"
                        placeholder="Search sold out badges..."
                        value={soldOutSearchTerm}
                        onChange={(e) => setSoldOutSearchTerm(e.target.value)}
                        className={styles.searchInput}
                      />
                    </div>
                  )}
                  <div className={styles.tableContainer}>
                    <BadgeTableList
                      badges={displaySoldOutBadges}
                      onEdit={handleEditClick}
                      onArchive={deleteBadge}
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
              <span>SOLD OUT Badges (0)</span>
            </div>
            <div className={styles.emptyState}>No sold out badges available.</div>
          </>
        )}
      </div>

      <EditBadgeModal 
        editingBadge={editingBadge} 
        setEditingBadge={setEditingBadge} 
        onSuccess={() => setSoldOutSearchTerm('')}
      />
    </>
  );
};

export default SoldOutBadgesCard;
