import React from 'react';
import { useTeamsActions } from '../../stores';
import { Team } from '../../types';

interface Props {
  archivedTeams: Team[];
  searchTerm?: string;
  onClearSearch?: () => void;
}

const ArchivedTeams: React.FC<Props> = ({ archivedTeams, searchTerm = '', onClearSearch }) => {
  // Get store actions
  const { restoreTeam, deleteTeam } = useTeamsActions();
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
              <button onClick={() => handleDelete(t.id)} className="btn btn-danger">
                Delete Forever
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ArchivedTeams;
