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
  useTeamsList,
} from '../../stores';
import { useAuth } from '../../stores/authStore';
import { Product } from '../../types';
import { getBadgeInfo, getKitTypeInfo, getNamesetInfo, getTeamInfo } from '../../utils/utils';

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  searchTerm?: string;
  isReadOnly?: boolean;
}

const ProductsTableList: React.FC<Props> = ({ products, onEdit, onDelete, searchTerm = '', isReadOnly = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Check if this is a public route
  const isPublicRoute = location.pathname.startsWith('/public');

  // Check if user is admin
  const isAdmin = user?.role === 'admin' && isAuthenticated;

  // Show total quantity only for admins on non-public routes
  const showTotal = isAdmin && !isPublicRoute;

  // Get data from stores
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();

  // Check if product is out of stock
  const isOutOfStock = (product: Product) => {
    return product.sizes.every((size) => size.quantity === 0);
  };

  // Get stock status for a given quantity
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return 'NO STOCK';
    if (quantity <= 2) return 'LOW STOCK';
    return 'IN STOCK';
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const teamInfo = getTeamInfo(product.teamId, teams, archivedTeams);
    const namesetInfo = getNamesetInfo(product.namesetId, namesets, archivedNamesets);
    const badgeInfo = getBadgeInfo(product.badgeId, badges, archivedBadges);
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teamInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      namesetInfo.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      namesetInfo.season.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badgeInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toString().includes(searchTerm)
    );
  });

  // Handle product row click
  const handleProductClick = (productId: string) => {
    const isPublicRoute = location.pathname.startsWith('/public');
    navigate(isPublicRoute ? `/public/products/${productId}` : `/products/${productId}`);
  };

  if (products.length === 0) {
    return <p>No products available.</p>;
  }

  if (filteredProducts.length === 0 && searchTerm) {
    return <p>No products found matching "{searchTerm}".</p>;
  }

  return (
    <>
      {/* Desktop Table */}
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
            {!isPublicRoute && <th>Location</th>}
            {!isReadOnly && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr
              key={p.id}
              className={`product-row ${isOutOfStock(p) ? 'out-of-stock-row' : ''}`}
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
              <td>
                {getTeamInfo(p.teamId, teams, archivedTeams)}
                {isOutOfStock(p) && <div className="out-of-stock-badge">OUT OF STOCK</div>}
              </td>
              <td>{p.name || '-'}</td>
              <td>{p.type}</td>
              <td>{getKitTypeInfo(p.kitTypeId, kitTypes, archivedKitTypes)}</td>
              <td>
                <div className="size-quantity-display">
                  {showTotal
                    ? (() => {
                        const totalQuantity = p.sizes.reduce((sum, sq) => sum + sq.quantity, 0);
                        const isTotalOutOfStock = totalQuantity === 0;
                        const isTotalLowStock = totalQuantity >= 1 && totalQuantity <= 3;

                        return (
                          <>
                            <div
                              className={`size-quantity-item total-quantity ${isTotalOutOfStock ? 'total-zero' : isTotalLowStock ? 'total-low' : 'total-stocked'}`}
                            >
                              Total: {totalQuantity}
                            </div>
                            {p.sizes.map((sq) => {
                              const isOutOfStock = sq.quantity === 0;
                              const isLowStock = sq.quantity > 0 && sq.quantity <= 2;

                              return (
                                <div
                                  key={sq.size}
                                  className={`size-quantity-item ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}`}
                                >
                                  {sq.size}: {sq.quantity}
                                </div>
                              );
                            })}
                          </>
                        );
                      })()
                    : p.sizes.map((sq) => {
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
              <td className="price-display">{p.price.toFixed ? p.price.toFixed(2) : p.price} RON</td>
              {!isPublicRoute && <td>{p.location || '-'}</td>}
              {!isReadOnly && (
                <td onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onEdit(p)} className="btn btn-icon btn-success" title="Edit">
                    ✏️
                  </button>
                  <button onClick={() => onDelete(p.id)} className="btn btn-icon btn-secondary" title="Archive">
                    📦
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card Layout */}
      <div className="mobile-table-cards">
        {filteredProducts.map((p) => {
          const teamInfo = getTeamInfo(p.teamId, teams, archivedTeams);
          const namesetInfo = getNamesetInfo(p.namesetId, namesets, archivedNamesets);
          const badgeInfo = getBadgeInfo(p.badgeId, badges, archivedBadges);
          const kitTypeInfo = getKitTypeInfo(p.kitTypeId, kitTypes, archivedKitTypes);
          const isOutOfStockProduct = isOutOfStock(p);

          return (
            <div
              key={p.id}
              className={`mobile-table-card ${isOutOfStockProduct ? 'out-of-stock-row' : ''}`}
              onClick={() => handleProductClick(p.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="mobile-card-header">
                {p.images && p.images.length > 0 ? (
                  <img
                    src={p.images.find((img) => img.isPrimary)?.imageUrl || p.images[0].imageUrl}
                    alt={p.name || 'Product image'}
                    className="mobile-card-image"
                  />
                ) : (
                  <div className="mobile-card-no-image">📷</div>
                )}
                <div className="mobile-card-title">
                  <h4>{teamInfo}</h4>
                  <p className="mobile-card-subtitle">{p.name || '-'}</p>
                </div>
                <div className="mobile-card-price">{p.price.toFixed ? p.price.toFixed(2) : p.price} RON</div>
              </div>

              <div className="mobile-card-details">
                <div className="mobile-detail-item">
                  <span className="mobile-detail-label">Type</span>
                  <span className="mobile-detail-value">{p.type}</span>
                </div>
                <div className="mobile-detail-item">
                  <span className="mobile-detail-label">Kit Type</span>
                  <span className="mobile-detail-value">{kitTypeInfo}</span>
                </div>
                <div className="mobile-detail-item">
                  <span className="mobile-detail-label">Season</span>
                  <span className="mobile-detail-value">{namesetInfo.season}</span>
                </div>
                <div className="mobile-detail-item">
                  <span className="mobile-detail-label">Player</span>
                  <span className="mobile-detail-value">{namesetInfo.playerName}</span>
                </div>
                {namesetInfo.number > 0 && (
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Number</span>
                    <span className="mobile-detail-value">{namesetInfo.number}</span>
                  </div>
                )}
                <div className="mobile-detail-item">
                  <span className="mobile-detail-label">Badge</span>
                  <span className="mobile-detail-value">{badgeInfo}</span>
                </div>
                {!isPublicRoute && p.location && (
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Location</span>
                    <span className="mobile-detail-value">{p.location}</span>
                  </div>
                )}
                {isOutOfStockProduct && (
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Status</span>
                    <span className="mobile-detail-value out-of-stock">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="mobile-card-status">
                <div className="size-quantity-display">
                  {showTotal
                    ? (() => {
                        const totalQuantity = p.sizes.reduce((sum, sq) => sum + sq.quantity, 0);
                        const isTotalOutOfStock = totalQuantity === 0;
                        const isTotalLowStock = totalQuantity >= 1 && totalQuantity <= 3;

                        return (
                          <>
                            <span
                              className={`mobile-status-badge total-quantity ${
                                isTotalOutOfStock ? 'total-zero' : isTotalLowStock ? 'total-low' : 'total-stocked'
                              }`}
                            >
                              Total: {totalQuantity}
                            </span>
                            {p.sizes.map((sq) => {
                              const isOutOfStockSize = sq.quantity === 0;
                              const isLowStockSize = sq.quantity > 0 && sq.quantity <= 2;

                              return (
                                <span
                                  key={sq.size}
                                  className={`mobile-status-badge ${
                                    isOutOfStockSize ? 'out-of-stock' : isLowStockSize ? 'low-stock' : 'in-stock'
                                  }`}
                                >
                                  {sq.size}: {sq.quantity}
                                </span>
                              );
                            })}
                          </>
                        );
                      })()
                    : p.sizes.map((sq) => {
                        const stockStatus = getStockStatus(sq.quantity);
                        const isOutOfStockSize = sq.quantity === 0;
                        const isLowStockSize = sq.quantity > 0 && sq.quantity <= 2;

                        return (
                          <span
                            key={sq.size}
                            className={`mobile-status-badge ${
                              isOutOfStockSize ? 'out-of-stock' : isLowStockSize ? 'low-stock' : 'in-stock'
                            }`}
                          >
                            {sq.size}: {isPublicRoute ? stockStatus : sq.quantity}
                          </span>
                        );
                      })}
                </div>
                {!isReadOnly && (
                  <div className="mobile-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEdit(p)} className="btn btn-success" title="Edit">
                      Edit
                    </button>
                    <button onClick={() => onDelete(p.id)} className="btn btn-secondary" title="Archive">
                      Archive
                    </button>
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

export default ProductsTableList;
