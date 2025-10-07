import React, { useState } from 'react';
import { useBadgesActions, useBadgesList, useBadgesSearch, useSearchActions } from '../../stores';
import { Badge } from '../../types';
import styles from '../shared/TableListCard.module.css';
import BadgeTableList from './BadgeTableList';
import EditBadgeModal from './EditBadgeModal';

const BadgeTableListCard: React.FC = () => {
  // Get data and actions from stores
  const badges = useBadgesList();
  const { archiveBadge } = useBadgesActions();
  const badgesSearchTerm = useBadgesSearch();
  const { setSearchTerm, clearSearchTerm } = useSearchActions();
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [isBadgesExpanded, setIsBadgesExpanded] = useState(true);

  const handleArchive = (id: string) => {
    archiveBadge(id);
    clearSearchTerm('badges'); // Clear search after action
  };

  const handleEditClick = (b: Badge) => {
    setEditingBadge(b);
  };

  return (
    <>
      <div className="card">
        {badges.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-orange ${styles.expandableHeader}`}
              onClick={() => setIsBadgesExpanded(!isBadgesExpanded)}
            >
              <span>Active Badges ({badges.length})</span>
              <span className={`${styles.expandIcon} ${isBadgesExpanded ? styles.expanded : styles.collapsed}`}>▼</span>
            </div>
            {!isBadgesExpanded && (
              <div className={styles.collapsedContent}>There are {badges.length} badges available.</div>
            )}
            {isBadgesExpanded && (
              <>
                <h3 className="card-section-header">Active Badges List</h3>
                {badges.length >= 2 && (
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="Search badges..."
                      value={badgesSearchTerm}
                      onChange={(e) => setSearchTerm('badges', e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                )}
                <div className={styles.tableContainer}>
                  <BadgeTableList
                    badges={badges}
                    onEdit={handleEditClick}
                    onArchive={handleArchive}
                    searchTerm={badgesSearchTerm}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-orange">
              <span>Active Badges (0)</span>
            </div>
            <div className={styles.emptyState}>No active badges available.</div>
          </>
        )}
      </div>

      <EditBadgeModal editingBadge={editingBadge} setEditingBadge={setEditingBadge} />
    </>
  );
};

export default BadgeTableListCard;
