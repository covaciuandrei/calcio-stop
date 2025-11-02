import React from 'react';
import { League } from '../../types';

interface Props {
  leagues: League[];
  onEdit: (league: League) => void;
  onArchive: (id: string) => void;
  searchTerm?: string;
  isReadOnly?: boolean;
}

const LeagueTableList: React.FC<Props> = ({ leagues, onEdit, onArchive, searchTerm = '', isReadOnly = false }) => {
  // Filter leagues based on search term
  const filteredLeagues = leagues.filter((league) => league.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (leagues.length === 0) {
    return <p>No leagues available.</p>;
  }

  if (filteredLeagues.length === 0 && searchTerm) {
    return <p>No leagues found matching "{searchTerm}".</p>;
  }

  return (
    <>
      {/* Desktop Table */}
      <table>
        <thead>
          <tr>
            <th>League Name</th>
            {!isReadOnly && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredLeagues.map((l) => (
            <tr key={l.id}>
              <td>{l.name}</td>
              {!isReadOnly && (
                <td>
                  <button onClick={() => onEdit(l)} className="btn btn-icon btn-success" title="Edit">
                    ✏️
                  </button>
                  <button onClick={() => onArchive(l.id)} className="btn btn-icon btn-secondary" title="Archive">
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
        {filteredLeagues.map((l) => (
          <div key={l.id} className="mobile-table-card">
            <div className="mobile-card-header">
              <div className="mobile-card-title">
                <h4>{l.name}</h4>
              </div>
            </div>

            {!isReadOnly && (
              <div className="mobile-card-status">
                <div className="mobile-card-actions">
                  <button onClick={() => onEdit(l)} className="btn btn-success" title="Edit">
                    Edit
                  </button>
                  <button onClick={() => onArchive(l.id)} className="btn btn-secondary" title="Archive">
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

export default LeagueTableList;

