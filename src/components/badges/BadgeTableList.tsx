import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBadgeImagesMapDebounced } from '../../hooks/useBadgeImages';
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
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in public context
  const isPublicRoute = location.pathname.startsWith('/public');

  // Get badge images for all badges with debouncing to prevent request storms
  const badgeIds = badges.map((badge) => badge.id);
  const { imagesMap } = useBadgeImagesMapDebounced(badgeIds, 500);

  // Check if badge is out of stock
  const isOutOfStock = (badge: { quantity: number }) => {
    return badge.quantity === 0;
  };

  // Handle badge row click
  const handleBadgeClick = (badgeId: string) => {
    navigate(isPublicRoute ? `/public/badges/${badgeId}` : `/badges/${badgeId}`);
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
          <th>Image</th>
          <th>Name</th>
          <th>Season</th>
          <th>Quantity</th>
          <th>Price</th>
          {!isReadOnly && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {filteredBadges.map((b) => {
          const badgeImages = imagesMap[b.id] || [];
          const primaryImage = badgeImages.find((img) => img.isPrimary) || badgeImages[0];

          return (
            <tr
              key={b.id}
              className={`badge-row ${isOutOfStock(b) ? 'out-of-stock-row' : ''}`}
              onClick={() => handleBadgeClick(b.id)}
              style={{ cursor: 'pointer' }}
            >
              <td
                className="badge-image-preview"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBadgeClick(b.id);
                }}
                title="Click to view badge details"
              >
                {primaryImage ? (
                  <img src={primaryImage.imageUrl} alt={b.name || 'Badge image'} className="badge-thumbnail" />
                ) : (
                  <div className="no-image-placeholder">📷</div>
                )}
              </td>
              <td>
                {b.name}
                {isOutOfStock(b) && <div className="out-of-stock-badge">OUT OF STOCK</div>}
              </td>
              <td>{b.season}</td>
              <td className="price-display">{b.quantity}</td>
              <td className="price-display">${b.price.toFixed(2)}</td>
              {!isReadOnly && (
                <td onClick={(e) => e.stopPropagation()}>
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
          );
        })}
      </tbody>
    </table>
  );
};

export default BadgeTableList;
