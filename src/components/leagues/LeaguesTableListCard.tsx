import React, { useState } from 'react';
import { useLeaguesActions, useLeaguesList, useSearchActions } from '../../stores';
import { League } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditLeagueModal from './EditLeagueModal';
import LeagueTableList from './LeagueTableList';

interface LeaguesTableListCardProps {
  leagues?: League[];
  isReadOnly?: boolean;
  showActions?: boolean;
  limit?: number;
}

const LeaguesTableListCard: React.FC<LeaguesTableListCardProps> = ({
  leagues: propLeagues,
  isReadOnly = false,
  showActions = true,
  limit,
}) => {
  // Get data and actions from stores
  const storeLeagues = useLeaguesList();
  const { archiveLeague } = useLeaguesActions();
  const { clearSearchTerm } = useSearchActions();
  const [editingLeague, setEditingLeague] = useState<League | null>(null);
  const [isLeaguesExpanded, setIsLeaguesExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Use prop leagues if provided, otherwise use store leagues
  const leagues = propLeagues || storeLeagues;
  const displayLeagues = limit ? leagues.slice(0, limit) : leagues;

  const handleArchive = (id: string) => {
    if (!isReadOnly) {
      archiveLeague(id);
      clearSearchTerm('leagues'); // Clear search after action
    }
  };

  const handleEditClick = (l: League) => {
    if (!isReadOnly) {
      setEditingLeague(l);
    }
  };

  return (
    <>
      <div className="card">
        {displayLeagues.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-orange ${!isReadOnly ? styles.expandableHeader : ''}`}
              onClick={!isReadOnly ? () => setIsLeaguesExpanded(!isLeaguesExpanded) : undefined}
            >
              <span>
                Active Leagues ({displayLeagues.length}
                {limit && leagues.length > limit ? ` (showing ${limit})` : ''})
              </span>
              {!isReadOnly && (
                <span className={`${styles.expandIcon} ${isLeaguesExpanded ? styles.expanded : styles.collapsed}`}>
                  ▼
                </span>
              )}
            </div>
            {!isReadOnly && !isLeaguesExpanded && (
              <div className={styles.collapsedContent}>There are {displayLeagues.length} leagues available.</div>
            )}
            {(isReadOnly || isLeaguesExpanded) && (
              <>
                <h3 className="card-section-header">Leagues List</h3>
                {displayLeagues.length >= 2 && !isReadOnly && (
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="Search leagues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                )}
                <div className={styles.tableContainer}>
                  <LeagueTableList
                    leagues={displayLeagues}
                    onEdit={handleEditClick}
                    onArchive={handleArchive}
                    searchTerm={searchTerm}
                    isReadOnly={isReadOnly}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-orange">
              <span>Active Leagues (0)</span>
            </div>
            <div className={styles.emptyState}>No active leagues available.</div>
          </>
        )}
      </div>

      <EditLeagueModal editingLeague={editingLeague} setEditingLeague={setEditingLeague} />
    </>
  );
};

export default LeaguesTableListCard;

