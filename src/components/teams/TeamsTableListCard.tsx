import React, { useState } from 'react';
import { Team } from '../../types';
import EditTeamModal from './EditTeamModal';
import TeamTableList from './TeamTableList';

interface Props {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  archivedTeams: Team[];
  setArchivedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const TeamsTableListCard: React.FC<Props> = ({ teams, setTeams, archivedTeams, setArchivedTeams }) => {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isTeamsExpanded, setIsTeamsExpanded] = useState(true);
  const [teamsSearchTerm, setTeamsSearchTerm] = useState('');

  const handleArchive = (id: string) => {
    if (!window.confirm('Are you sure you want to archive this team?')) return;
    const teamToArchive = teams.find((t) => t.id === id);
    if (teamToArchive) {
      setArchivedTeams((prev) => [...prev, teamToArchive]);
      setTeams(teams.filter((t) => t.id !== id));
    }
  };

  const handleEditClick = (t: Team) => {
    setEditingTeam(t);
  };

  return (
    <>
      <div className="card">
        {teams.length > 0 ? (
          <>
            <div
              className="card-header mini-header mini-header-orange"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onClick={() => setIsTeamsExpanded(!isTeamsExpanded)}
            >
              <span>Active Teams ({teams.length})</span>
              <span style={{ fontSize: '12px' }}>{isTeamsExpanded ? '▼' : '▶'}</span>
            </div>
            {!isTeamsExpanded && (
              <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                There are {teams.length} teams available.
              </div>
            )}
            {isTeamsExpanded && (
              <>
                <h3 className="card-section-header">Active Teams List</h3>
                {teams.length >= 2 && (
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="Search teams..."
                      value={teamsSearchTerm}
                      onChange={(e) => setTeamsSearchTerm(e.target.value)}
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
                  <TeamTableList
                    teams={teams}
                    onEdit={handleEditClick}
                    onArchive={handleArchive}
                    searchTerm={teamsSearchTerm}
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
            <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
              No active teams available.
            </div>
          </>
        )}
      </div>

      <EditTeamModal editingTeam={editingTeam} setEditingTeam={setEditingTeam} setTeams={setTeams} />
    </>
  );
};

export default TeamsTableListCard;
