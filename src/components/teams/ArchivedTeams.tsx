import React from 'react';
import { useTeamsActions, useTeamsStore } from '../../stores';
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
  // Filter teams based on search term
  const filteredTeams = archivedTeams.filter((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeams.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>
                <button onClick={() => handleRestore(t.id)} className="btn btn-icon btn-success" title="Restore">
                  ↩️
                </button>
                <button onClick={() => handleDelete(t.id)} className="btn btn-icon btn-danger" title="Delete Forever">
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArchivedTeams;
