import React from 'react';
import { useLeaguesActions } from '../../stores';
import { League } from '../../types';

interface Props {
  archivedLeagues: League[];
  searchTerm?: string;
  onClearSearch?: () => void;
}

const ArchivedLeagues: React.FC<Props> = ({ archivedLeagues, searchTerm = '', onClearSearch }) => {
  const { restoreLeague, deleteLeague } = useLeaguesActions();

  // Filter leagues based on search term
  const filteredLeagues = archivedLeagues.filter((league) =>
    league.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestore = (id: string) => {
    restoreLeague(id);
    if (onClearSearch) onClearSearch();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this league? This action cannot be undone.')) {
      deleteLeague(id);
      if (onClearSearch) onClearSearch();
    }
  };

  if (archivedLeagues.length === 0) {
    return <p>No archived leagues available.</p>;
  }

  if (filteredLeagues.length === 0 && searchTerm) {
    return <p>No archived leagues found matching "{searchTerm}".</p>;
  }

  return (
    <>
      {/* Desktop Table */}
      <table>
        <thead>
          <tr>
            <th>League Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeagues.map((l) => (
            <tr key={l.id}>
              <td>{l.name}</td>
              <td>
                <button onClick={() => handleRestore(l.id)} className="btn btn-icon btn-success" title="Restore">
                  ↩️
                </button>
                <button onClick={() => handleDelete(l.id)} className="btn btn-icon btn-danger" title="Delete Forever">
                  🗑️
                </button>
              </td>
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

            <div className="mobile-card-status">
              <div className="mobile-card-actions">
                <button onClick={() => handleRestore(l.id)} className="btn btn-success" title="Restore">
                  Restore
                </button>
                <button onClick={() => handleDelete(l.id)} className="btn btn-danger" title="Delete Forever">
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ArchivedLeagues;

