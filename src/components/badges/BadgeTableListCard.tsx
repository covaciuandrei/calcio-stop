import React, { useState } from 'react';
import { useBadgesActions, useBadgesList, useBadgesSearch, useSearchActions } from '../../stores';
import { Badge } from '../../types';
import styles from '../shared/TableListCard.module.css';
import BadgeTableList from './BadgeTableList';
import EditBadgeModal from './EditBadgeModal';

interface BadgeTableListCardProps {
  badges?: Badge[];
  isReadOnly?: boolean;
  showActions?: boolean;
  limit?: number;
}

const BadgeTableListCard: React.FC<BadgeTableListCardProps> = ({
  badges: propBadges,
  isReadOnly = false,
  showActions = true,
  limit,
}) => {
  // Get data and actions from stores
  const storeBadges = useBadgesList();
  const { archiveBadge } = useBadgesActions();
  const badgesSearchTerm = useBadgesSearch();
  const { setSearchTerm, clearSearchTerm } = useSearchActions();
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [isBadgesExpanded, setIsBadgesExpanded] = useState(true);

  // Use prop badges if provided, otherwise use store badges
  const badges = propBadges || storeBadges;
  const displayBadges = limit ? badges.slice(0, limit) : badges;

  const handleArchive = (id: string) => {
    if (!isReadOnly) {
      archiveBadge(id);
      clearSearchTerm('badges'); // Clear search after action
    }
  };

  const handleEditClick = (b: Badge) => {
    if (!isReadOnly) {
      setEditingBadge(b);
    }
  };

  return (
    <>
      <div className="card">
        {displayBadges.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-orange ${!isReadOnly ? styles.expandableHeader : ''}`}
              onClick={!isReadOnly ? () => setIsBadgesExpanded(!isBadgesExpanded) : undefined}
            >
              <span>
                Active Badges ({displayBadges.length}
                {limit && badges.length > limit ? ` (showing ${limit})` : ''})
              </span>
              {!isReadOnly && (
                <span className={`${styles.expandIcon} ${isBadgesExpanded ? styles.expanded : styles.collapsed}`}>
                  ▼
                </span>
              )}
            </div>
            {!isReadOnly && !isBadgesExpanded && (
              <div className={styles.collapsedContent}>There are {displayBadges.length} badges available.</div>
            )}
            {(isReadOnly || isBadgesExpanded) && (
              <>
                <h3 className="card-section-header">Badges List</h3>
                {displayBadges.length >= 2 && !isReadOnly && (
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
                    badges={displayBadges}
                    onEdit={handleEditClick}
                    onArchive={handleArchive}
                    searchTerm={badgesSearchTerm}
                    isReadOnly={isReadOnly}
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
