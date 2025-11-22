import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useArchivedKitTypes, useKitTypesList } from '../../stores';
import { Nameset } from '../../types';
import { getKitTypeInfo } from '../../utils/utils';

interface Props {
  namesets: Nameset[];
  onEdit: (n: Nameset) => void;
  onDelete?: (id: string) => void;
  onArchive: (id: string) => void;
  searchTerm?: string;
  isReadOnly?: boolean;
}

const NamesetTableList: React.FC<Props> = ({
  namesets,
  onEdit,
  onDelete,
  onArchive,
  searchTerm = '',
  isReadOnly = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Check if this is a public route
  const isPublicRoute = location.pathname.startsWith('/public');

  // Get data from stores
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();

  // Create images map from namesets prop (images already included from optimized query)
  const imagesMap = useMemo(() => {
    const map: Record<string, (typeof namesets)[0]['images']> = {};
    namesets.forEach((nameset) => {
      if (nameset.images && nameset.images.length > 0) {
        map[nameset.id] = nameset.images;
      }
    });
    return map;
  }, [namesets]);

  // Check if nameset is out of stock
  const isOutOfStock = (nameset: { quantity: number }) => {
    return nameset.quantity === 0;
  };

  // Get stock status
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return 'NO STOCK';
    if (quantity <= 2) return 'LOW STOCK';
    return 'IN STOCK';
  };

  // Handle nameset row click
  const handleNamesetClick = (namesetId: string) => {
    navigate(isPublicRoute ? `/public/namesets/${namesetId}` : `/namesets/${namesetId}`);
  };

  // Filter namesets based on search term
  const filteredNamesets = namesets.filter(
    (nameset) =>
      (nameset.playerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (nameset.season || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (nameset.number || '').toString().includes(searchTerm)
  );

  if (namesets.length === 0) {
    return <p>No namesets available.</p>;
  }

  if (filteredNamesets.length === 0 && searchTerm) {
    return <p>No namesets found matching "{searchTerm}".</p>;
  }

  return (
    <>
      {/* Desktop Table */}
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Player</th>
            <th>Number</th>
            <th>Season</th>
            <th>Kit Type</th>
            <th>{isPublicRoute ? 'Availability' : 'Quantity'}</th>
            <th>Price</th>
            {!isPublicRoute && <th>Location</th>}
            {!isReadOnly && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredNamesets.map((n) => {
            const isOutOfStockNameset = isOutOfStock(n);
            // Use images from nameset prop (already loaded from optimized query) or fallback to empty array
            const namesetImages = n.images || imagesMap[n.id] || [];
            const primaryImage = namesetImages.find((img) => img.isPrimary) || namesetImages[0];

            return (
              <tr
                key={n.id}
                className={`nameset-row ${isOutOfStockNameset ? 'out-of-stock-row' : ''}`}
                onClick={() => handleNamesetClick(n.id)}
                style={{ cursor: 'pointer' }}
              >
                <td
                  className="nameset-image-preview"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNamesetClick(n.id);
                  }}
                  title="Click to view nameset details"
                >
                  {primaryImage ? (
                    <img
                      src={primaryImage.thumbnailUrl || primaryImage.imageUrl}
                      alt={n.playerName || 'Nameset image'}
                      className="nameset-thumbnail"
                    />
                  ) : (
                    <div className="no-image-placeholder">📷</div>
                  )}
                </td>
                <td>
                  {n.playerName}
                  {isOutOfStockNameset && <div className="out-of-stock-badge">OUT OF STOCK</div>}
                </td>
                <td>{n.number}</td>
                <td>{n.season}</td>
                <td>{getKitTypeInfo(n.kitTypeId, kitTypes, archivedKitTypes)}</td>
                <td className="price-display">
                  {isPublicRoute ? (
                    <span
                      className={`nameset-stock-status ${
                        n.quantity === 0 ? 'out-of-stock' : n.quantity <= 2 ? 'low-stock' : 'in-stock'
                      }`}
                    >
                      {getStockStatus(n.quantity)}
                    </span>
                  ) : (
                    n.quantity
                  )}
                </td>
                <td className="price-display">{n.price.toFixed(2)} RON</td>
                {!isPublicRoute && <td>{n.location || '-'}</td>}
                {!isReadOnly && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEdit(n)} className="btn btn-icon btn-success" title="Edit">
                      ✏️
                    </button>
                    <button onClick={() => onArchive(n.id)} className="btn btn-icon btn-secondary" title="Archive">
                      📦
                    </button>
                    {onDelete && (
                      <button onClick={() => onDelete(n.id)} className="btn btn-icon btn-danger" title="Delete">
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
        {filteredNamesets.map((n) => {
          const isOutOfStockNameset = isOutOfStock(n);
          // Use images from nameset prop (already loaded from optimized query) or fallback to empty array
          const namesetImages = n.images || imagesMap[n.id] || [];
          const primaryImage = namesetImages.find((img) => img.isPrimary) || namesetImages[0];
          const stockStatus = getStockStatus(n.quantity);

          return (
            <div
              key={n.id}
              className={`mobile-table-card ${isOutOfStockNameset ? 'out-of-stock-row' : ''}`}
              onClick={() => handleNamesetClick(n.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="mobile-card-header">
                {primaryImage ? (
                  <img
                    src={primaryImage.thumbnailUrl || primaryImage.imageUrl}
                    alt={n.playerName || 'Nameset image'}
                    className="mobile-card-image"
                  />
                ) : (
                  <div className="mobile-card-no-image">📷</div>
                )}
                <div className="mobile-card-title">
                  <h4>{n.playerName}</h4>
                  <p className="mobile-card-subtitle">
                    #{n.number} - {n.season}
                  </p>
                </div>
                <div className="mobile-card-price">{n.price.toFixed(2)} RON</div>
              </div>

              <div className="mobile-card-details">
                <div className="mobile-detail-item">
                  <span className="mobile-detail-label">Kit Type</span>
                  <span className="mobile-detail-value">{getKitTypeInfo(n.kitTypeId, kitTypes, archivedKitTypes)}</span>
                </div>
                <div className="mobile-detail-item">
                  <span className="mobile-detail-label">Availability</span>
                  <span className="mobile-detail-value">{isPublicRoute ? stockStatus : `${n.quantity} units`}</span>
                </div>
                {!isPublicRoute && n.location && (
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Location</span>
                    <span className="mobile-detail-value">{n.location}</span>
                  </div>
                )}
                {isOutOfStockNameset && (
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Status</span>
                    <span className="mobile-detail-value out-of-stock">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="mobile-card-status">
                <span
                  className={`mobile-status-badge ${
                    n.quantity === 0 ? 'out-of-stock' : n.quantity <= 2 ? 'low-stock' : 'in-stock'
                  }`}
                >
                  {stockStatus}
                </span>
                {!isReadOnly && (
                  <div className="mobile-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEdit(n)} className="btn btn-success" title="Edit">
                      Edit
                    </button>
                    <button onClick={() => onArchive(n.id)} className="btn btn-secondary" title="Archive">
                      Archive
                    </button>
                    {onDelete && (
                      <button onClick={() => onDelete(n.id)} className="btn btn-danger" title="Delete">
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

export default NamesetTableList;
