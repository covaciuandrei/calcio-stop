import React from 'react';
import { Badge } from '../../types';

interface Props {
  badges: Badge[];
  onEdit: (b: Badge) => void;
  onDelete?: (id: string) => void;
  onArchive: (id: string) => void;
  searchTerm?: string;
}

const BadgeTableList: React.FC<Props> = ({ badges, onEdit, onDelete, onArchive, searchTerm = '' }) => {
  // Filter badges based on search term
  const filteredBadges = badges.filter(
    (badge) =>
      badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.season.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (badges.length === 0) {
    return <p>No badges available.</p>;
  }

  if (filteredBadges.length === 0 && searchTerm) {
    return <p>No badges found matching "{searchTerm}".</p>;
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
              <button onClick={() => onEdit(b)} className="btn btn-warning">
                Edit
              </button>
              <button onClick={() => onArchive(b.id)} className="btn btn-secondary">
                Archive
              </button>
              {onDelete && (
                <button onClick={() => onDelete(b.id)} className="btn btn-danger">
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BadgeTableList;
