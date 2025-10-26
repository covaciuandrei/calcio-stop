import React from 'react';
import { useBadgesActions, useBadgesStore } from '../../stores';
import { Badge } from '../../types';

interface Props {
  archivedBadges: Badge[];
  searchTerm?: string;
  onClearSearch?: () => void;
}

const ArchivedBadges: React.FC<Props> = ({ archivedBadges, searchTerm = '', onClearSearch }) => {
  // Get store actions and state
  const { restoreBadge, deleteBadge } = useBadgesActions();
  const { error, clearError } = useBadgesStore();
  // Filter badges based on search term
  const filteredBadges = archivedBadges.filter(
    (badge) =>
      (badge.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (badge.season || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestore = (id: string) => {
    restoreBadge(id);
    onClearSearch?.(); // Clear search after action
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this badge?')) {
      try {
        await deleteBadge(id);
        onClearSearch?.(); // Clear search after action
      } catch (error) {
        // Error will be handled by the store and shown via error toast
        console.error('Delete failed:', error);
      }
    }
  };

  if (archivedBadges.length === 0) {
    return <p>No archived badges available.</p>;
  }

  if (filteredBadges.length === 0 && searchTerm) {
    return <p>No archived badges found matching "{searchTerm}".</p>;
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
            <th>Name</th>
            <th>Season</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBadges.map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.season}</td>
              <td className="price-display">{b.quantity}</td>
              <td>
                <button onClick={() => handleRestore(b.id)} className="btn btn-icon btn-success" title="Restore">
                  ↩️
                </button>
                <button onClick={() => handleDelete(b.id)} className="btn btn-icon btn-danger" title="Delete Forever">
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

export default ArchivedBadges;
