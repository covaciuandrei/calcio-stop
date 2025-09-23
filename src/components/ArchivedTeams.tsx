import React from 'react';
import { Team } from '../types/types';

interface Props {
  archivedTeams: Team[];
  setArchivedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  searchTerm?: string;
}

const ArchivedTeams: React.FC<Props> = ({ archivedTeams, setArchivedTeams, setTeams, searchTerm = '' }) => {
  // Filter teams based on search term
  const filteredTeams = archivedTeams.filter((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleRestore = (id: string) => {
    const teamToRestore = archivedTeams.find((t) => t.id === id);
    if (teamToRestore) {
      setTeams((prev) => [...prev, teamToRestore]);
      setArchivedTeams((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this team?')) {
      setArchivedTeams((prev) => prev.filter((t) => t.id !== id));
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
              <button onClick={() => handleRestore(t.id)} className="btn btn-warning">
                Restore
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
