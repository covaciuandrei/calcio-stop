import React from 'react';
import { Team } from '../../types';

interface Props {
  teams: Team[];
  onEdit: (team: Team) => void;
  onArchive: (id: string) => void;
  searchTerm?: string;
}

const TeamTableList: React.FC<Props> = ({ teams, onEdit, onArchive, searchTerm = '' }) => {
  // Filter teams based on search term
  const filteredTeams = teams.filter((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (teams.length === 0) {
    return <p>No teams available.</p>;
  }

  if (filteredTeams.length === 0 && searchTerm) {
    return <p>No teams found matching "{searchTerm}".</p>;
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
              <button onClick={() => onEdit(t)} className="btn btn-warning">
                Edit
              </button>
              <button onClick={() => onArchive(t.id)} className="btn btn-secondary">
                Archive
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeamTableList;
