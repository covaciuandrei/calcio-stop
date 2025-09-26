import React, { useState } from 'react';
import { Badge } from '../types/types';
import ArchivedBadges from './ArchivedBadges';
import BadgeSection from './BadgeSection';

interface Props {
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  archivedBadges: Badge[];
  setArchivedBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
}

const BadgesPage: React.FC<Props> = ({ badges, setBadges, archivedBadges, setArchivedBadges }) => {
  const [isArchivedBadgesExpanded, setIsArchivedBadgesExpanded] = useState(false);
  const [archivedBadgesSearchTerm, setArchivedBadgesSearchTerm] = useState('');

  return (
    <div>
      {/* Active Badges Section */}
      <BadgeSection
        badges={badges}
        setBadges={setBadges}
        archivedBadges={archivedBadges}
        setArchivedBadges={setArchivedBadges}
      />

      {/* Archived Badges Card */}
      <div className="card" style={{ marginTop: '20px' }}>
        {archivedBadges.length > 0 ? (
          <>
            <div
              className="card-header mini-header mini-header-red"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onClick={() => setIsArchivedBadgesExpanded(!isArchivedBadgesExpanded)}
            >
              <span>Archived Badges ({archivedBadges.length})</span>
              <span style={{ fontSize: '12px' }}>{isArchivedBadgesExpanded ? '▼' : '▶'}</span>
            </div>
            {!isArchivedBadgesExpanded && (
              <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                There are {archivedBadges.length} badges available.
              </div>
            )}
            {isArchivedBadgesExpanded && (
              <>
                <h3 className="card-section-header">Archived Badges List</h3>
                {archivedBadges.length >= 2 && (
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="Search archived badges..."
                      value={archivedBadgesSearchTerm}
                      onChange={(e) => setArchivedBadgesSearchTerm(e.target.value)}
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
                  <ArchivedBadges
                    archivedBadges={archivedBadges}
                    setArchivedBadges={setArchivedBadges}
                    setBadges={setBadges}
                    searchTerm={archivedBadgesSearchTerm}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-red">
              <span>Archived Badges (0)</span>
            </div>
            <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
              No archived badges available.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BadgesPage;
