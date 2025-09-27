import React, { useState } from 'react';
import { Badge } from '../../types';
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
              className="card-header mini-header mini-header-orange"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onClick={() => setIsBadgesExpanded(!isBadgesExpanded)}
            >
              <span>Active Badges ({badges.length})</span>
              <span style={{ fontSize: '12px' }}>{isBadgesExpanded ? '▼' : '▶'}</span>
            </div>
            {!isBadgesExpanded && (
              <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                There are {badges.length} badges available.
              </div>
            )}
            {isBadgesExpanded && (
              <>
                <h3 className="card-section-header">Active Badges List</h3>
                {badges.length >= 2 && (
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="Search badges..."
                      value={badgesSearchTerm}
                      onChange={(e) => setBadgesSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                )}
                <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
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
            <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
              No active badges available.
            </div>
          </>
        )}
      </div>

      <EditBadgeModal editingBadge={editingBadge} setEditingBadge={setEditingBadge} setBadges={setBadges} />
    </>
  );
};

export default BadgeTableListCard;
