import React from 'react';
import { useLeaguesList } from '../../stores';
import { Team } from '../../types';

interface Props {
  teams: Team[];
  onEdit: (team: Team) => void;
  onArchive: (id: string) => void;
  searchTerm?: string;
  isReadOnly?: boolean;
}

const TeamTableList: React.FC<Props> = ({ teams, onEdit, onArchive, searchTerm = '', isReadOnly = false }) => {
  // Get leagues for displaying league names
  const leagues = useLeaguesList();

  // Filter teams based on search term
  const filteredTeams = teams.filter((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Helper function to get league names from IDs
  const getLeagueNames = (leagueIds: string[]): string[] => {
    if (!leagueIds || leagueIds.length === 0) return [];
    return leagueIds
      .map((id) => leagues.find((l) => l.id === id)?.name)
      .filter((name): name is string => !!name);
  };

  if (teams.length === 0) {
    return <p>No teams available.</p>;
  }

  if (filteredTeams.length === 0 && searchTerm) {
    return <p>No teams found matching "{searchTerm}".</p>;
  }

  return (
    <>
      {/* Desktop Table */}
      <table>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Leagues</th>
            {!isReadOnly && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredTeams.map((t) => {
            const leagueNames = getLeagueNames(t.leagues || []);
            return (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>
                  {leagueNames.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {leagueNames.map((leagueName) => (
                        <span
                          key={leagueName}
                          style={{
                            padding: '2px 8px',
                            backgroundColor: '#e0e7ff',
                            color: '#3730a3',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                          }}
                        >
                          {leagueName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No leagues</span>
                  )}
                </td>
                {!isReadOnly && (
                  <td>
                    <button onClick={() => onEdit(t)} className="btn btn-icon btn-success" title="Edit">
                      ✏️
                    </button>
                    <button onClick={() => onArchive(t.id)} className="btn btn-icon btn-secondary" title="Archive">
                      📦
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile Card Layout */}
      <div className="mobile-table-cards">
        {filteredTeams.map((t) => {
          const leagueNames = getLeagueNames(t.leagues || []);
          return (
            <div key={t.id} className="mobile-table-card">
              <div className="mobile-card-header">
                <div className="mobile-card-title">
                  <h4>{t.name}</h4>
                </div>
              </div>

              <div className="mobile-card-status" style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Leagues:</div>
                {leagueNames.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {leagueNames.map((leagueName) => (
                      <span
                        key={leagueName}
                        style={{
                          padding: '2px 8px',
                          backgroundColor: '#e0e7ff',
                          color: '#3730a3',
                          borderRadius: '12px',
                          fontSize: '0.875rem',
                        }}
                      >
                        {leagueName}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.875rem' }}>No leagues</span>
                )}
              </div>

              {!isReadOnly && (
                <div className="mobile-card-status">
                  <div className="mobile-card-actions">
                    <button onClick={() => onEdit(t)} className="btn btn-success" title="Edit">
                      Edit
                    </button>
                    <button onClick={() => onArchive(t.id)} className="btn btn-secondary" title="Archive">
                      Archive
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TeamTableList;
