import React from 'react';
import { Badge } from '../../types';

interface Props {
  badges: Badge[];
  onEdit: (b: Badge) => void;
  onDelete?: (id: string) => void;
  onArchive: (id: string) => void;
  searchTerm?: string;
  isReadOnly?: boolean;
}

const BadgeTableList: React.FC<Props> = ({
  badges,
  onEdit,
  onDelete,
  onArchive,
  searchTerm = '',
  isReadOnly = false,
}) => {
  // Check if badge is out of stock
  const isOutOfStock = (badge: { quantity: number }) => {
    return badge.quantity === 0;
  };

  // Filter badges based on search term
  const filteredBadges = badges.filter(
    (badge) =>
      (badge.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (badge.season || '').toLowerCase().includes(searchTerm.toLowerCase())
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
          {!isReadOnly && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {filteredBadges.map((b) => (
          <tr key={b.id} className={isOutOfStock(b) ? 'out-of-stock-row' : ''}>
            <td>
              {b.name}
              {isOutOfStock(b) && <div className="out-of-stock-badge">OUT OF STOCK</div>}
            </td>
            <td>{b.season}</td>
            <td className="price-display">{b.quantity}</td>
            {!isReadOnly && (
              <td>
                <button onClick={() => onEdit(b)} className="btn btn-icon btn-success" title="Edit">
                  ✏️
                </button>
                <button onClick={() => onArchive(b.id)} className="btn btn-icon btn-secondary" title="Archive">
                  📦
                </button>
                {onDelete && (
                  <button onClick={() => onDelete(b.id)} className="btn btn-icon btn-danger" title="Delete">
                    🗑️
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BadgeTableList;
