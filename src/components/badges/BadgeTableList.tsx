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

  // Get stock status for a given quantity
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return 'NO STOCK';
    if (quantity <= 2) return 'LOW STOCK';
    return 'IN STOCK';
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
    <>
      {/* Desktop Table */}
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Season</th>
            <th>{isPublicRoute ? 'Availability' : 'Quantity'}</th>
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
                <td className="price-display">
                  {isPublicRoute ? (
                    <span
                      className={`badge-stock-status ${
                        b.quantity === 0 ? 'out-of-stock' : b.quantity <= 2 ? 'low-stock' : 'in-stock'
                      }`}
                    >
                      {getStockStatus(b.quantity)}
                    </span>
                  ) : (
                    b.quantity
                  )}
                </td>
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

      {/* Mobile Card Layout */}
      <div className="mobile-table-cards">
        {filteredBadges.map((b) => {
          const badgeImages = imagesMap[b.id] || [];
          const primaryImage = badgeImages.find((img) => img.isPrimary) || badgeImages[0];
          const stockStatus = getStockStatus(b.quantity);
          const isOutOfStockBadge = isOutOfStock(b);

          return (
            <div
              key={b.id}
              className={`mobile-table-card ${isOutOfStockBadge ? 'out-of-stock-row' : ''}`}
              onClick={() => handleBadgeClick(b.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="mobile-card-header">
                {primaryImage ? (
                  <img src={primaryImage.imageUrl} alt={b.name || 'Badge image'} className="mobile-card-image" />
                ) : (
                  <div className="mobile-card-no-image">📷</div>
                )}
                <div className="mobile-card-title">
                  <h4>{b.name}</h4>
                  <p className="mobile-card-subtitle">{b.season}</p>
                </div>
                <div className="mobile-card-price">${b.price.toFixed(2)}</div>
              </div>

              <div className="mobile-card-details">
                <div className="mobile-detail-item">
                  <span className="mobile-detail-label">Availability</span>
                  <span className="mobile-detail-value">{isPublicRoute ? stockStatus : `${b.quantity} units`}</span>
                </div>
                {isOutOfStockBadge && (
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Status</span>
                    <span className="mobile-detail-value out-of-stock">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="mobile-card-status">
                <span
                  className={`mobile-status-badge ${
                    b.quantity === 0 ? 'out-of-stock' : b.quantity <= 2 ? 'low-stock' : 'in-stock'
                  }`}
                >
                  {stockStatus}
                </span>
                {!isReadOnly && (
                  <div className="mobile-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEdit(b)} className="btn btn-success" title="Edit">
                      Edit
                    </button>
                    <button onClick={() => onArchive(b.id)} className="btn btn-secondary" title="Archive">
                      Archive
                    </button>
                    {onDelete && (
                      <button onClick={() => onDelete(b.id)} className="btn btn-danger" title="Delete">
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BadgeTableList;
