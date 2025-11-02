import React from 'react';
import { useLeaguesList, useTeamsActions, useTeamsStore } from '../../stores';
import { Team } from '../../types';

interface Props {
  archivedTeams: Team[];
  searchTerm?: string;
  onClearSearch?: () => void;
}

const ArchivedTeams: React.FC<Props> = ({ archivedTeams, searchTerm = '', onClearSearch }) => {
  // Get store actions and state
  const { restoreTeam, deleteTeam } = useTeamsActions();
  const { error, clearError } = useTeamsStore();
  const leagues = useLeaguesList();

  // Filter teams based on search term
  const filteredTeams = archivedTeams.filter((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Helper function to get league names from IDs
  const getLeagueNames = (leagueIds: string[]): string[] => {
    if (!leagueIds || leagueIds.length === 0) return [];
    return leagueIds
      .map((id) => leagues.find((l) => l.id === id)?.name)
      .filter((name): name is string => !!name);
  };

  const handleRestore = (id: string) => {
    restoreTeam(id);
    onClearSearch?.(); // Clear search after action
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this team?')) {
      deleteTeam(id);
      onClearSearch?.(); // Clear search after action
    }
  };

  if (archivedTeams.length === 0) {
    return <p>No archived teams available.</p>;
  }

  if (filteredTeams.length === 0 && searchTerm) {
    return <p>No archived teams found matching "{searchTerm}".</p>;
  }

  return (
    <div>
      {error && (
        <div
          className="error-message"
          style={{
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
          }}
        >
          {error}
          <button
            onClick={clearError}
            style={{ marginLeft: '0.5rem', background: 'none', border: 'none', fontSize: '1.2em', cursor: 'pointer' }}
            title="Clear error"
          >
            ×
          </button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Leagues</th>
            <th>Actions</th>
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
                <td>
                  <button onClick={() => handleRestore(t.id)} className="btn btn-icon btn-success" title="Restore">
                    ↩️
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="btn btn-icon btn-danger" title="Delete Forever">
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ArchivedTeams;
