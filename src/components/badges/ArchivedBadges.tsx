import React from 'react';
import { useBadgesActions } from '../../stores';
import { Badge } from '../../types';

interface Props {
  archivedBadges: Badge[];
  searchTerm?: string;
  onClearSearch?: () => void;
}

const ArchivedBadges: React.FC<Props> = ({ archivedBadges, searchTerm = '', onClearSearch }) => {
  // Get store actions
  const { restoreBadge, deleteBadge } = useBadgesActions();
  // Filter badges based on search term
  const filteredBadges = archivedBadges.filter(
    (badge) =>
      badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.season.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestore = (id: string) => {
    restoreBadge(id);
    onClearSearch?.(); // Clear search after action
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this badge?')) {
      deleteBadge(id);
      onClearSearch?.(); // Clear search after action
    }
  };

  if (archivedBadges.length === 0) {
    return <p>No archived badges available.</p>;
  }

  if (filteredBadges.length === 0 && searchTerm) {
    return <p>No archived badges found matching "{searchTerm}".</p>;
  }

  return (
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
              <button onClick={() => handleRestore(b.id)} className="btn btn-warning">
                Restore
              </button>
              <button onClick={() => handleDelete(b.id)} className="btn btn-danger">
                Delete Forever
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ArchivedBadges;
