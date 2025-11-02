import React from 'react';
import { Team } from '../../types';

interface Props {
  teams: Team[];
  onEdit: (team: Team) => void;
  onArchive: (id: string) => void;
  searchTerm?: string;
  isReadOnly?: boolean;
}

const TeamTableList: React.FC<Props> = ({ teams, onEdit, onArchive, searchTerm = '', isReadOnly = false }) => {
  // Filter teams based on search term
  const filteredTeams = teams.filter((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
            {!isReadOnly && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredTeams.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
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
          ))}
        </tbody>
      </table>

      {/* Mobile Card Layout */}
      <div className="mobile-table-cards">
        {filteredTeams.map((t) => (
          <div key={t.id} className="mobile-table-card">
            <div className="mobile-card-header">
              <div className="mobile-card-title">
                <h4>{t.name}</h4>
              </div>
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
        ))}
      </div>
    </>
  );
};

export default TeamTableList;
