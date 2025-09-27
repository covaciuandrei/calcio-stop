import React, { useState } from 'react';
import { Badge } from '../../types';
import styles from '../shared/TableListCard.module.css';
import BadgeTableList from './BadgeTableList';
import EditBadgeModal from './EditBadgeModal';

interface Props {
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  archivedBadges: Badge[];
  setArchivedBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
}

const BadgeTableListCard: React.FC<Props> = ({ badges, setBadges, archivedBadges, setArchivedBadges }) => {
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [isBadgesExpanded, setIsBadgesExpanded] = useState(true);
  const [badgesSearchTerm, setBadgesSearchTerm] = useState('');

  const handleArchive = (id: string) => {
    if (!window.confirm('Are you sure you want to archive this badge?')) return;
    const badgeToArchive = badges.find((b) => b.id === id);
    if (badgeToArchive) {
      setArchivedBadges((prev) => [...prev, badgeToArchive]);
      setBadges(badges.filter((b) => b.id !== id));
    }
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
                      onChange={(e) => setBadgesSearchTerm(e.target.value)}
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

      <EditBadgeModal editingBadge={editingBadge} setEditingBadge={setEditingBadge} setBadges={setBadges} />
    </>
  );
};

export default BadgeTableListCard;
