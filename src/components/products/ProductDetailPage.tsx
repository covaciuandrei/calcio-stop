import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  useArchivedBadges,
  useArchivedKitTypes,
  useArchivedNamesets,
  useArchivedProducts,
  useArchivedTeams,
  useBadgesList,
  useKitTypesList,
  useNamesetsList,
  useProductsList,
  useTeamsList,
} from '../../stores';
import { useAuth } from '../../stores/authStore';
import { Product } from '../../types';
import { getBadgeInfo, getKitTypeInfo, getNamesetInfo, getTeamInfo } from '../../utils/utils';
import EditProductModal from './EditProductModal';
import './ProductDetailPage.css';
import ProductImageManager from './ProductImageManager';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const badgeDropdownRef = useRef<HTMLDivElement>(null);
  const namesetDropdownRef = useRef<HTMLDivElement>(null);

  // Check if this is a public route or user is not authenticated/admin
  const isPublicRoute = location.pathname.startsWith('/public');
  const isAdmin = user?.role === 'admin' && isAuthenticated;
  const showAdminFeatures = isAdmin && !isPublicRoute;

  // Get data from stores
  const activeProducts = useProductsList();
  const archivedProducts = useArchivedProducts();
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();

  const [product, setProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [isBadgeDropdownOpen, setIsBadgeDropdownOpen] = useState(false);
  const [selectedNamesetId, setSelectedNamesetId] = useState<string | null>(null);
  const [isNamesetDropdownOpen, setIsNamesetDropdownOpen] = useState(false);

  // Find the product (check both active and archived)
  useEffect(() => {
    if (id) {
      const foundProduct = activeProducts.find((p) => p.id === id) || archivedProducts.find((p) => p.id === id);
      setProduct(foundProduct || null);
      // Initialize selected badge and nameset from product if they exist
      if (foundProduct?.badgeId) {
        setSelectedBadgeId(foundProduct.badgeId);
      }
      if (foundProduct?.namesetId) {
        setSelectedNamesetId(foundProduct.namesetId);
      }
    }
  }, [id, activeProducts, archivedProducts]);

  // Close badge dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (badgeDropdownRef.current && !badgeDropdownRef.current.contains(event.target as Node)) {
        setIsBadgeDropdownOpen(false);
      }
    };

    if (isBadgeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBadgeDropdownOpen]);

  // Close nameset dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (namesetDropdownRef.current && !namesetDropdownRef.current.contains(event.target as Node)) {
        setIsNamesetDropdownOpen(false);
      }
    };

    if (isNamesetDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNamesetDropdownOpen]);

  // Calculate total price
  const selectedBadge = badges.find((b) => b.id === selectedBadgeId);
  const selectedNameset = namesets.find((n) => n.id === selectedNamesetId);

  // Only add prices for badges/namesets that are selected but not already assigned to the product
  const badgePrice =
    selectedBadge && selectedBadge.price && selectedBadgeId !== product?.badgeId ? selectedBadge.price : 0;
  const namesetPrice =
    selectedNameset && selectedNameset.price && selectedNamesetId !== product?.namesetId ? selectedNameset.price : 0;
  const totalPrice = product ? product.price + badgePrice + namesetPrice : 0;

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="card">
          <div className="card-header">
            <h2>Product Not Found</h2>
          </div>
          <div className="card-content">
            <p>The requested product could not be found.</p>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get related information
  const teamInfo = getTeamInfo(product.teamId, teams, archivedTeams);
  const namesetInfo = getNamesetInfo(product.namesetId, namesets, archivedNamesets);
  const kitTypeInfo = getKitTypeInfo(product.kitTypeId, kitTypes, archivedKitTypes);
  const badgeInfo = getBadgeInfo(product.badgeId, badges, archivedBadges);

  // Check if product is out of stock
  const isOutOfStock = product.sizes.every((size) => size.quantity === 0);

  // Get stock status for a given quantity
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return 'NO STOCK';
    if (quantity <= 2) return 'LOW STOCK';
    return 'IN STOCK';
  };

  const handleEditClick = () => {
    if (showAdminFeatures) {
      setIsEditing(true);
    }
  };

  const handleEditClose = () => {
    setIsEditing(false);
    // Refresh the product data after editing
    if (id) {
      const foundProduct = activeProducts.find((p) => p.id === id) || archivedProducts.find((p) => p.id === id);
      setProduct(foundProduct || null);
    }
  };

  return (
    <div className={`product-detail-page ${isPublicRoute ? 'public-mode' : ''}`}>
      {/* Header */}
      <div className="product-detail-header">
        <button
          onClick={() => navigate(isPublicRoute ? '/public/products' : '/products')}
          className="btn btn-secondary"
        >
          ← Back to Products
        </button>
        {showAdminFeatures && (
          <button onClick={handleEditClick} className="btn btn-primary admin-only">
            Edit Product
          </button>
        )}
      </div>

      <div className="product-detail-content">
        {/* Product Images */}
        <div className="product-images-section">
          <div className="card">
            <div className="card-header">
              <h3>Product Images</h3>
            </div>
            <div className="card-content">
              <ProductImageManager productId={product.id} isAdmin={showAdminFeatures} />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="product-details-section">
          <div className="card">
            <div className="card-header">
              <h2>{product.name || 'Unnamed Product'}</h2>
              {isOutOfStock && <span className="out-of-stock-badge">OUT OF STOCK</span>}
            </div>
            <div className="card-content">
              <div className="product-details-grid">
                <div className="detail-item">
                  <label>Team:</label>
                  <span>{teamInfo}</span>
                </div>
                <div className="detail-item">
                  <label>Type:</label>
                  <span>{product.type}</span>
                </div>
                <div className="detail-item">
                  <label>Kit Type:</label>
                  <span>{kitTypeInfo}</span>
                </div>
                <div className="detail-item">
                  <label>Price:</label>
                  <span className="price-display">{product.price.toFixed(2)} RON</span>
                </div>
                {product.olxLink && (
                  <div className="detail-item">
                    <label>OLX Link:</label>
                    <a
                      href={product.olxLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ display: 'inline-block', marginTop: '4px' }}
                    >
                      View on OLX
                    </a>
                  </div>
                )}
                {product.namesetId && (
                  <>
                    <div className="detail-item">
                      <label>Season:</label>
                      <span>{namesetInfo.season}</span>
                    </div>
                    <div className="detail-item">
                      <label>Player:</label>
                      <span>{namesetInfo.playerName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Number:</label>
                      <span>{namesetInfo.number > 0 ? namesetInfo.number : '-'}</span>
                    </div>
                  </>
                )}
                {product.badgeId && (
                  <div className="detail-item">
                    <label>Badge:</label>
                    <span>{badgeInfo}</span>
                  </div>
                )}
                {!isPublicRoute && (
                  <div className="detail-item">
                    <label>Created:</label>
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Add Badge Section - always show to allow additional badges */}
              <div className="add-badge-section">
                <div className={`add-badge-label-row ${!product.badgeId ? 'short-text' : ''}`}>
                  <span className="add-badge-label">
                    {product.badgeId
                      ? 'See other badges available (ask if its possible to have this shirt with another badge):'
                      : 'Add Badge:'}
                  </span>
                  {!product.badgeId && (
                    <div className="badge-dropdown-container" ref={badgeDropdownRef}>
                      <div
                        className="badge-dropdown-trigger"
                        onClick={() => setIsBadgeDropdownOpen(!isBadgeDropdownOpen)}
                      >
                        {selectedBadgeId && selectedBadge
                          ? `${selectedBadge.name} (${selectedBadge.price || 0} RON)`
                          : 'Select a badge'}
                        <span className="badge-dropdown-arrow">▼</span>
                      </div>
                      {isBadgeDropdownOpen && (
                        <div className="badge-dropdown">
                          {badges.length === 0 ? (
                            <div className="badge-dropdown-empty">No badges available</div>
                          ) : (
                            <>
                              <div
                                className={`badge-dropdown-option ${selectedBadgeId === null ? 'selected' : ''}`}
                                onClick={() => {
                                  setSelectedBadgeId(null);
                                  setIsBadgeDropdownOpen(false);
                                }}
                              >
                                <div className="badge-option-name">None</div>
                                <div className="badge-option-details">No badge selected</div>
                              </div>
                              {badges.map((badge) => (
                                <div
                                  key={badge.id}
                                  className={`badge-dropdown-option ${selectedBadgeId === badge.id ? 'selected' : ''}`}
                                  onClick={() => {
                                    setSelectedBadgeId(badge.id);
                                    setIsBadgeDropdownOpen(false);
                                  }}
                                >
                                  <div className="badge-option-name">{badge.name}</div>
                                  <div className="badge-option-details">
                                    Season: {badge.season} | Price: {badge.price || 0} RON | Qty: {badge.quantity}
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {product.badgeId && (
                  <div className="add-badge-picker-row">
                    <div className="badge-dropdown-container" ref={badgeDropdownRef}>
                      <div
                        className="badge-dropdown-trigger"
                        onClick={() => setIsBadgeDropdownOpen(!isBadgeDropdownOpen)}
                      >
                        {selectedBadgeId && selectedBadge
                          ? `${selectedBadge.name} (${selectedBadge.price || 0} RON)`
                          : product.badgeId && !selectedBadgeId
                            ? 'Select additional badge'
                            : 'Select a badge'}
                        <span className="badge-dropdown-arrow">▼</span>
                      </div>
                      {isBadgeDropdownOpen && (
                        <div className="badge-dropdown">
                          {badges.length === 0 ? (
                            <div className="badge-dropdown-empty">No badges available</div>
                          ) : (
                            <>
                              <div
                                className={`badge-dropdown-option ${selectedBadgeId === null ? 'selected' : ''}`}
                                onClick={() => {
                                  setSelectedBadgeId(null);
                                  setIsBadgeDropdownOpen(false);
                                }}
                              >
                                <div className="badge-option-name">None</div>
                                <div className="badge-option-details">No badge selected</div>
                              </div>
                              {badges.map((badge) => (
                                <div
                                  key={badge.id}
                                  className={`badge-dropdown-option ${selectedBadgeId === badge.id ? 'selected' : ''}`}
                                  onClick={() => {
                                    setSelectedBadgeId(badge.id);
                                    setIsBadgeDropdownOpen(false);
                                  }}
                                >
                                  <div className="badge-option-name">{badge.name}</div>
                                  <div className="badge-option-details">
                                    Season: {badge.season} | Price: {badge.price || 0} RON | Qty: {badge.quantity}
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Add Nameset Section - only show if product doesn't already have a nameset */}
              {!product.namesetId && (
                <div className="add-nameset-section">
                  <div className="add-nameset-row">
                    <span className="add-nameset-label">Add Nameset:</span>
                    <div className="nameset-dropdown-container" ref={namesetDropdownRef}>
                      <div
                        className="nameset-dropdown-trigger"
                        onClick={() => setIsNamesetDropdownOpen(!isNamesetDropdownOpen)}
                      >
                        {selectedNamesetId && selectedNameset
                          ? `${selectedNameset.playerName} #${selectedNameset.number} (${selectedNameset.price || 0} RON)`
                          : 'Select a nameset'}
                        <span className="nameset-dropdown-arrow">▼</span>
                      </div>
                      {isNamesetDropdownOpen && (
                        <div className="nameset-dropdown">
                          {namesets.length === 0 ? (
                            <div className="nameset-dropdown-empty">No namesets available</div>
                          ) : (
                            <>
                              <div
                                className={`nameset-dropdown-option ${selectedNamesetId === null ? 'selected' : ''}`}
                                onClick={() => {
                                  setSelectedNamesetId(null);
                                  setIsNamesetDropdownOpen(false);
                                }}
                              >
                                <div className="nameset-option-name">None</div>
                                <div className="nameset-option-details">No nameset selected</div>
                              </div>
                              {namesets.map((nameset) => (
                                <div
                                  key={nameset.id}
                                  className={`nameset-dropdown-option ${selectedNamesetId === nameset.id ? 'selected' : ''}`}
                                  onClick={() => {
                                    setSelectedNamesetId(nameset.id);
                                    setIsNamesetDropdownOpen(false);
                                  }}
                                >
                                  <div className="nameset-option-name">
                                    {nameset.playerName} #{nameset.number}
                                  </div>
                                  <div className="nameset-option-details">
                                    Season: {nameset.season} | Price: {nameset.price || 0} RON | Qty: {nameset.quantity}
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Total Price Display */}
              <div className="total-price-section">
                <div className="total-price-row">
                  <span className="total-price-label">Base Price:</span>
                  <span className="total-price-value">{product.price.toFixed(2)} RON</span>
                </div>
                {selectedBadge && selectedBadgeId !== product.badgeId && (
                  <div className="total-price-row">
                    <span className="total-price-label">Badge ({selectedBadge.name}):</span>
                    <span className="total-price-value">+{(badgePrice || 0).toFixed(2)} RON</span>
                  </div>
                )}
                {selectedNameset && selectedNamesetId !== product.namesetId && (
                  <div className="total-price-row">
                    <span className="total-price-label">
                      Nameset ({selectedNameset.playerName} #{selectedNameset.number}):
                    </span>
                    <span className="total-price-value">+{(namesetPrice || 0).toFixed(2)} RON</span>
                  </div>
                )}
                <div className="total-price-row total-price-final">
                  <span className="total-price-label">Total:</span>
                  <span className="total-price-value">{totalPrice.toFixed(2)} RON</span>
                </div>
              </div>

              {/* Sizes and Quantities */}
              <div className="sizes-section">
                <h4>Sizes & Quantities</h4>
                <div className="sizes-grid">
                  {product.sizes.map((sizeQty) => {
                    const stockStatus = getStockStatus(sizeQty.quantity);
                    const isOutOfStock = sizeQty.quantity === 0;
                    const isLowStock = sizeQty.quantity > 0 && sizeQty.quantity <= 2;

                    return (
                      <div
                        key={sizeQty.size}
                        className={`size-item ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}`}
                      >
                        <span className="size-label">{sizeQty.size}</span>
                        <span className="quantity-label">{isPublicRoute ? stockStatus : sizeQty.quantity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && <EditProductModal editingProduct={product} setEditingProduct={handleEditClose} />}
    </div>
  );
};

export default ProductDetailPage;
