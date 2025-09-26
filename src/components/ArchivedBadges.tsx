import React from 'react';
import { Badge } from '../types/types';

interface Props {
  archivedBadges: Badge[];
  setArchivedBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  searchTerm?: string;
}

const ArchivedBadges: React.FC<Props> = ({ archivedBadges, setArchivedBadges, setBadges, searchTerm = '' }) => {
  // Filter badges based on search term
  const filteredBadges = archivedBadges.filter(
    (badge) =>
      badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.season.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestore = (id: string) => {
    const badgeToRestore = archivedBadges.find((b) => b.id === id);
    if (badgeToRestore) {
      setBadges((prev) => [...prev, badgeToRestore]);
      setArchivedBadges((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this badge?')) {
      setArchivedBadges((prev) => prev.filter((b) => b.id !== id));
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
