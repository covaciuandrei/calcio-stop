import React, { useState } from 'react';
import { useSearchActions, useTeamsActions, useTeamsList, useTeamsSearch } from '../../stores';
import { Team } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditTeamModal from './EditTeamModal';
import TeamTableList from './TeamTableList';

interface TeamsTableListCardProps {
  teams?: Team[];
  isReadOnly?: boolean;
  showActions?: boolean;
  limit?: number;
}

const TeamsTableListCard: React.FC<TeamsTableListCardProps> = ({
  teams: propTeams,
  isReadOnly = false,
  showActions = true,
  limit,
}) => {
  // Get data and actions from stores
  const storeTeams = useTeamsList();
  const { archiveTeam } = useTeamsActions();
  const teamsSearchTerm = useTeamsSearch();
  const { setSearchTerm, clearSearchTerm } = useSearchActions();
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isTeamsExpanded, setIsTeamsExpanded] = useState(true);

  // Use prop teams if provided, otherwise use store teams
  const teams = propTeams || storeTeams;
  const displayTeams = limit ? teams.slice(0, limit) : teams;

  const handleArchive = (id: string) => {
    if (!isReadOnly) {
      archiveTeam(id);
      clearSearchTerm('teams'); // Clear search after action
    }
  };

  const handleEditClick = (t: Team) => {
    if (!isReadOnly) {
      setEditingTeam(t);
    }
  };

  return (
    <>
      <div className="card">
        {displayTeams.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-orange ${!isReadOnly ? styles.expandableHeader : ''}`}
              onClick={!isReadOnly ? () => setIsTeamsExpanded(!isTeamsExpanded) : undefined}
            >
              <span>
                Active Teams ({displayTeams.length}
                {limit ? ` (showing ${limit})` : ''})
              </span>
              {!isReadOnly && (
                <span className={`${styles.expandIcon} ${isTeamsExpanded ? styles.expanded : styles.collapsed}`}>
                  ▼
                </span>
              )}
            </div>
            {!isReadOnly && !isTeamsExpanded && (
              <div className={styles.collapsedContent}>There are {displayTeams.length} teams available.</div>
            )}
            {(isReadOnly || isTeamsExpanded) && (
              <>
                <h3 className="card-section-header">Active Teams List</h3>
                {displayTeams.length >= 2 && !isReadOnly && (
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="Search teams..."
                      value={teamsSearchTerm}
                      onChange={(e) => setSearchTerm('teams', e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                )}
                <div className={styles.tableContainer}>
                  <TeamTableList
                    teams={displayTeams}
                    onEdit={handleEditClick}
                    onArchive={handleArchive}
                    searchTerm={teamsSearchTerm}
                    isReadOnly={isReadOnly}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-orange">
              <span>Active Teams (0)</span>
            </div>
            <div className={styles.emptyState}>No active teams available.</div>
          </>
        )}
      </div>

      <EditTeamModal editingTeam={editingTeam} setEditingTeam={setEditingTeam} />
    </>
  );
};

export default TeamsTableListCard;
