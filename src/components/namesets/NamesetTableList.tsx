import React from 'react';
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
  // Get data from stores
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();

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
            <th>Player</th>
            <th>Number</th>
            <th>Season</th>
            <th>Kit Type</th>
            <th>Quantity</th>
            <th>Price</th>
            {!isReadOnly && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredNamesets.map((n) => {
            const isLowStock = n.quantity > 0 && n.quantity <= 2;
            const isOutOfStockNameset = isOutOfStock(n);

            return (
              <tr key={n.id} className={isOutOfStockNameset ? 'out-of-stock-row' : ''}>
                <td>
                  {n.playerName}
                  {isOutOfStockNameset && <div className="out-of-stock-badge">OUT OF STOCK</div>}
                </td>
                <td>{n.number}</td>
                <td>{n.season}</td>
                <td>{getKitTypeInfo(n.kitTypeId, kitTypes, archivedKitTypes)}</td>
                <td className="quantity-display">
                  <span
                    className={`badge-stock-status ${
                      isOutOfStockNameset ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'
                    }`}
                  >
                    {getStockStatus(n.quantity)}
                  </span>
                  <br />
                  <span style={{ fontSize: '0.85em', color: 'var(--gray-600)' }}>{n.quantity}</span>
                </td>
                <td className="price-display">{n.price.toFixed(2)} RON</td>
                {!isReadOnly && (
                  <td>
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
          const isLowStock = n.quantity > 0 && n.quantity <= 2;
          const isOutOfStockNameset = isOutOfStock(n);

          return (
            <div key={n.id} className={`mobile-table-card ${isOutOfStockNameset ? 'out-of-stock-row' : ''}`}>
              <div className="mobile-card-header">
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
                  <span className="mobile-detail-label">Quantity</span>
                  <span className="mobile-detail-value">{n.quantity}</span>
                </div>
              </div>

              <div className="mobile-card-status">
                <span
                  className={`mobile-status-badge ${
                    isOutOfStockNameset ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'
                  }`}
                >
                  {getStockStatus(n.quantity)}
                </span>
                {!isReadOnly && (
                  <div className="mobile-card-actions">
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
