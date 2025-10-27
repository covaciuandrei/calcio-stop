import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useArchivedBadges,
  useArchivedKitTypes,
  useArchivedNamesets,
  useArchivedTeams,
  useBadgesList,
  useKitTypesList,
  useNamesetsList,
  useProductsActions,
  useProductsStore,
  useTeamsList,
} from '../../stores';
import { Product } from '../../types';
import { getBadgeInfo, getKitTypeInfo, getNamesetInfo, getTeamInfo } from '../../utils/utils';

interface Props {
  archivedProducts: Product[];
  searchTerm?: string;
  onClearSearch?: () => void;
}

const ArchivedProducts: React.FC<Props> = ({ archivedProducts, searchTerm = '', onClearSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if this is a public route
  const isPublicRoute = location.pathname.startsWith('/public');

  // Get data from stores
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();
  const { restoreProduct, deleteProduct } = useProductsActions();
  const { error, clearError } = useProductsStore();

  const handleRestore = (id: string) => {
    restoreProduct(id);
    onClearSearch?.(); // Clear search after action
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      deleteProduct(id);
      onClearSearch?.(); // Clear search after action
    }
  };

  // Get stock status for a given quantity
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return 'NO STOCK';
    if (quantity <= 2) return 'LOW STOCK';
    return 'IN STOCK';
  };

  // Handle product row click
  const handleProductClick = (productId: string) => {
    const isPublicRoute = location.pathname.startsWith('/public');
    navigate(isPublicRoute ? `/public/products/${productId}` : `/products/${productId}`);
  };

  // Filter products based on search term
  const filteredProducts = archivedProducts.filter(
    (product) =>
      (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (archivedProducts.length === 0) {
    return <p>No archived products.</p>;
  }

  if (filteredProducts.length === 0 && searchTerm) {
    return <p>No archived products found matching "{searchTerm}".</p>;
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
            <th>Image</th>
            <th>Team</th>
            <th>Notes</th>
            <th>Type</th>
            <th>Kit Type</th>
            <th>Sizes & Quantities</th>
            <th>Season</th>
            <th>Player</th>
            <th>Number</th>
            <th>Badge</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr
              key={p.id}
              className="product-row"
              onClick={() => handleProductClick(p.id)}
              style={{ cursor: 'pointer' }}
            >
              <td
                className="product-image-preview"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductClick(p.id);
                }}
                title="Click to view product details"
              >
                {p.images && p.images.length > 0 ? (
                  <img
                    src={p.images.find((img) => img.isPrimary)?.imageUrl || p.images[0].imageUrl}
                    alt={p.name || 'Product image'}
                    className="product-thumbnail"
                  />
                ) : (
                  <div className="no-image-placeholder">📷</div>
                )}
              </td>
              <td>{getTeamInfo(p.teamId, teams, archivedTeams)}</td>
              <td>{p.name || '-'}</td>
              <td>{p.type}</td>
              <td>{getKitTypeInfo(p.kitTypeId, kitTypes, archivedKitTypes)}</td>
              <td>
                <div className="size-quantity-display">
                  {p.sizes.map((sq) => {
                    const stockStatus = getStockStatus(sq.quantity);
                    const isOutOfStock = sq.quantity === 0;
                    const isLowStock = sq.quantity > 0 && sq.quantity <= 2;

                    return (
                      <div
                        key={sq.size}
                        className={`size-quantity-item ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}`}
                      >
                        {sq.size}: {isPublicRoute ? stockStatus : sq.quantity}
                      </div>
                    );
                  })}
                </div>
              </td>
              <td>
                {(() => {
                  const namesetInfo = getNamesetInfo(p.namesetId, namesets, archivedNamesets);
                  return namesetInfo.season;
                })()}
              </td>
              <td>
                {(() => {
                  const namesetInfo = getNamesetInfo(p.namesetId, namesets, archivedNamesets);
                  return namesetInfo.playerName;
                })()}
              </td>
              <td>
                {(() => {
                  const namesetInfo = getNamesetInfo(p.namesetId, namesets, archivedNamesets);
                  return namesetInfo.number > 0 ? namesetInfo.number : '-';
                })()}
              </td>
              <td>{getBadgeInfo(p.badgeId, badges, archivedBadges)}</td>
              <td className="price-display">${p.price.toFixed ? p.price.toFixed(2) : p.price}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <button onClick={() => handleRestore(p.id)} className="btn btn-icon btn-success" title="Restore">
                  ↩️
                </button>
                <button onClick={() => handleDelete(p.id)} className="btn btn-icon btn-danger" title="Delete Forever">
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

export default ArchivedProducts;
