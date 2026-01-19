import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useBadgeImagesMapDebounced } from '../../hooks/useBadgeImages';
import { useNamesetImagesMapDebounced } from '../../hooks/useNamesetImages';
import { useRouteData } from '../../hooks/useRouteData';
import { statsService } from '../../lib/statsService';
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
    useProductsLoading,
    useTeamsList,
} from '../../stores';
import { useAuth } from '../../stores/authStore';
import { Product } from '../../types';
import { getBadgeInfo, getKitTypeInfo, getNamesetInfo, getTeamInfo } from '../../utils/utils';
import EditProductModal from './EditProductModal';
import './ProductDetailPage.css';
import ProductImageManager from './ProductImageManager';

const ProductDetailPage: React.FC = () => {
  // Load data for this route (essential for direct page access/refresh)
  useRouteData();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const badgeDropdownRef = useRef<HTMLDivElement>(null);
  const namesetDropdownRef = useRef<HTMLDivElement>(null);

  // Check if this is a public route (not an admin route)
  const isPublicRoute = !location.pathname.startsWith('/admin');
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
  const isLoading = useProductsLoading();

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

  // Track product view when product is loaded (only for public routes)
  useEffect(() => {
    if (product && id && isPublicRoute) {
      statsService.trackProductView(id);
    }
  }, [product, id, isPublicRoute]);

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

  // Filter badges based on stock for public routes
  const availableBadges = isPublicRoute ? badges.filter((badge) => badge.quantity > 0) : badges;

  // Filter namesets based on stock for public routes
  const availableNamesets = isPublicRoute ? namesets.filter((nameset) => nameset.quantity > 0) : namesets;

  // Get images for badges and namesets in dropdowns
  const badgeIds = availableBadges.map((badge) => badge.id);
  const namesetIds = availableNamesets.map((nameset) => nameset.id);
  const { imagesMap: badgeImagesMap } = useBadgeImagesMapDebounced(badgeIds, 300);
  const { imagesMap: namesetImagesMap } = useNamesetImagesMapDebounced(namesetIds, 300);

  // Get images for the product's current badge and nameset (if they exist)
  // Also include selected badge/nameset from dropdowns
  const allBadgeIdsForImages = [
    ...(product?.badgeId ? [product.badgeId] : []),
    ...(selectedBadgeId && selectedBadgeId !== product?.badgeId ? [selectedBadgeId] : []),
  ];
  const allNamesetIdsForImages = [
    ...(product?.namesetId ? [product.namesetId] : []),
    ...(selectedNamesetId && selectedNamesetId !== product?.namesetId ? [selectedNamesetId] : []),
  ];
  const { imagesMap: productBadgeImagesMap } = useBadgeImagesMapDebounced(allBadgeIdsForImages, 300);
  const { imagesMap: productNamesetImagesMap } = useNamesetImagesMapDebounced(allNamesetIdsForImages, 300);

  // Get primary images for current product badge and nameset
  const currentBadgeImages = product?.badgeId ? productBadgeImagesMap[product.badgeId] || [] : [];
  const currentBadgePrimaryImage = currentBadgeImages.find((img) => img.isPrimary) || currentBadgeImages[0];
  const currentNamesetImages = product?.namesetId ? productNamesetImagesMap[product.namesetId] || [] : [];
  const currentNamesetPrimaryImage = currentNamesetImages.find((img) => img.isPrimary) || currentNamesetImages[0];

  // Get primary images for selected badge and nameset from dropdowns
  const selectedBadgeImages = selectedBadgeId ? productBadgeImagesMap[selectedBadgeId] || [] : [];
  const selectedBadgePrimaryImage = selectedBadgeImages.find((img) => img.isPrimary) || selectedBadgeImages[0];
  const selectedNamesetImages = selectedNamesetId ? productNamesetImagesMap[selectedNamesetId] || [] : [];
  const selectedNamesetPrimaryImage = selectedNamesetImages.find((img) => img.isPrimary) || selectedNamesetImages[0];

  // Calculate total price
  const selectedBadge = badges.find((b) => b.id === selectedBadgeId);
  const selectedNameset = namesets.find((n) => n.id === selectedNamesetId);

  // Only add prices for badges/namesets that are selected but not already assigned to the product
  const badgePrice =
    selectedBadge && selectedBadge.price && selectedBadgeId !== product?.badgeId ? selectedBadge.price : 0;
  const namesetPrice =
    selectedNameset && selectedNameset.price && selectedNamesetId !== product?.namesetId ? selectedNameset.price : 0;
  const totalPrice = product ? product.price + badgePrice + namesetPrice : 0;

  // Show loading state if data is loading and product is not yet found
  if (isLoading && !product) {
    return (
      <div className="product-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

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
    // The useEffect will automatically refresh the product when activeProducts/archivedProducts update
  };

  return (
    <div className={`product-detail-page ${isPublicRoute ? 'public-mode' : ''}`}>
      {/* Header */}
      <div className="product-detail-header">
        <button onClick={() => navigate(isPublicRoute ? '/products' : '/admin/products')} className="btn btn-secondary">
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
                  {product.isOnSale && product.salePrice ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--gray-500)', fontSize: '0.9em' }}>
                        {product.price.toFixed(2)} RON
                      </span>
                      <span className="price-display" style={{ color: 'var(--accent-red-600)', fontWeight: 'bold' }}>
                        {product.salePrice.toFixed(2)} RON
                        <span
                          style={{
                            marginLeft: '8px',
                            fontSize: '0.8em',
                            background: 'var(--accent-red-100)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          ON SALE
                        </span>
                      </span>
                    </div>
                  ) : (
                    <span className="price-display">{product.price.toFixed(2)} RON</span>
                  )}
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
                    <div className="detail-item detail-item-with-image">
                      <label>Nameset:</label>
                      <div className="detail-item-content">
                        {currentNamesetPrimaryImage && (
                          <img
                            src={currentNamesetPrimaryImage.imageUrl}
                            alt={namesetInfo.playerName || 'Nameset image'}
                            className="detail-item-image"
                          />
                        )}
                        <div className="detail-item-text">
                          <div className="detail-item-name">{namesetInfo.playerName}</div>
                          <div className="detail-item-subtitle">
                            #{namesetInfo.number > 0 ? namesetInfo.number : '-'} • {namesetInfo.season}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {product.badgeId && (
                  <div className="detail-item detail-item-with-image">
                    <label>Badge:</label>
                    <div className="detail-item-content">
                      {currentBadgePrimaryImage && (
                        <img
                          src={currentBadgePrimaryImage.imageUrl}
                          alt={badgeInfo || 'Badge image'}
                          className="detail-item-image"
                        />
                      )}
                      <div className="detail-item-text">
                        <div className="detail-item-name">{badgeInfo}</div>
                      </div>
                    </div>
                  </div>
                )}
                {!isPublicRoute && (
                  <div className="detail-item">
                    <label>Created:</label>
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                {showAdminFeatures && (
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{product.location || '-'}</span>
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
                          {availableBadges.length === 0 ? (
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
                              {availableBadges.map((badge) => {
                                const badgeImages = badgeImagesMap[badge.id] || [];
                                const primaryImage = badgeImages.find((img) => img.isPrimary) || badgeImages[0];
                                return (
                                  <div
                                    key={badge.id}
                                    className={`badge-dropdown-option ${selectedBadgeId === badge.id ? 'selected' : ''}`}
                                    onClick={() => {
                                      setSelectedBadgeId(badge.id);
                                      setIsBadgeDropdownOpen(false);
                                    }}
                                  >
                                    <div className="badge-option-content">
                                      {primaryImage && (
                                        <img
                                          src={primaryImage.thumbnailUrl || primaryImage.imageUrl}
                                          alt={badge.name || 'Badge image'}
                                          className="badge-option-image"
                                        />
                                      )}
                                      <div className="badge-option-text">
                                        <div className="badge-option-name">{badge.name}</div>
                                        <div className="badge-option-details">
                                          Season: {badge.season} | Price: {badge.price || 0} RON
                                          {!isPublicRoute && ` | Qty: ${badge.quantity}`}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
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
                          {availableBadges.length === 0 ? (
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
                              {availableBadges.map((badge) => {
                                const badgeImages = badgeImagesMap[badge.id] || [];
                                const primaryImage = badgeImages.find((img) => img.isPrimary) || badgeImages[0];
                                return (
                                  <div
                                    key={badge.id}
                                    className={`badge-dropdown-option ${selectedBadgeId === badge.id ? 'selected' : ''}`}
                                    onClick={() => {
                                      setSelectedBadgeId(badge.id);
                                      setIsBadgeDropdownOpen(false);
                                    }}
                                  >
                                    <div className="badge-option-content">
                                      {primaryImage && (
                                        <img
                                          src={primaryImage.thumbnailUrl || primaryImage.imageUrl}
                                          alt={badge.name || 'Badge image'}
                                          className="badge-option-image"
                                        />
                                      )}
                                      <div className="badge-option-text">
                                        <div className="badge-option-name">{badge.name}</div>
                                        <div className="badge-option-details">
                                          Season: {badge.season} | Price: {badge.price || 0} RON
                                          {!isPublicRoute && ` | Qty: ${badge.quantity}`}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
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
                          {availableNamesets.length === 0 ? (
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
                              {availableNamesets.map((nameset) => {
                                const namesetImages = namesetImagesMap[nameset.id] || [];
                                const primaryImage = namesetImages.find((img) => img.isPrimary) || namesetImages[0];
                                return (
                                  <div
                                    key={nameset.id}
                                    className={`nameset-dropdown-option ${selectedNamesetId === nameset.id ? 'selected' : ''}`}
                                    onClick={() => {
                                      setSelectedNamesetId(nameset.id);
                                      setIsNamesetDropdownOpen(false);
                                    }}
                                  >
                                    <div className="nameset-option-content">
                                      {primaryImage && (
                                        <img
                                          src={primaryImage.imageUrl}
                                          alt={nameset.playerName || 'Nameset image'}
                                          className="nameset-option-image"
                                        />
                                      )}
                                      <div className="nameset-option-text">
                                        <div className="nameset-option-name">
                                          {nameset.playerName} #{nameset.number}
                                        </div>
                                        <div className="nameset-option-details">
                                          Season: {nameset.season} | Price: {nameset.price || 0} RON
                                          {!isPublicRoute && ` | Qty: ${nameset.quantity}`}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
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
                  <div className="total-price-row total-price-row-with-image">
                    <div className="total-price-content">
                      {selectedBadgePrimaryImage && (
                        <img
                          src={selectedBadgePrimaryImage.imageUrl}
                          alt={selectedBadge.name || 'Badge image'}
                          className="total-price-image"
                        />
                      )}
                      <span className="total-price-label">Badge ({selectedBadge.name}):</span>
                    </div>
                    <span className="total-price-value">+{(badgePrice || 0).toFixed(2)} RON</span>
                  </div>
                )}
                {selectedNameset && selectedNamesetId !== product.namesetId && (
                  <div className="total-price-row total-price-row-with-image">
                    <div className="total-price-content">
                      {selectedNamesetPrimaryImage && (
                        <img
                          src={selectedNamesetPrimaryImage.imageUrl}
                          alt={selectedNameset.playerName || 'Nameset image'}
                          className="total-price-image"
                        />
                      )}
                      <span className="total-price-label">
                        Nameset ({selectedNameset.playerName} #{selectedNameset.number}):
                      </span>
                    </div>
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
                {showAdminFeatures &&
                  (() => {
                    const totalQuantity = product.sizes.reduce((sum, sq) => sum + sq.quantity, 0);
                    const isTotalOutOfStock = totalQuantity === 0;
                    const isTotalLowStock = totalQuantity >= 1 && totalQuantity <= 3;

                    return (
                      <div
                        className={`size-item total-quantity ${isTotalOutOfStock ? 'total-zero' : isTotalLowStock ? 'total-low' : 'total-stocked'}`}
                        style={{
                          marginBottom: 'var(--space-3)',
                          width: '100%',
                          maxWidth: '200px',
                          margin: '0 auto var(--space-3)',
                        }}
                      >
                        <span className="size-label">Total:</span>
                        <span className="quantity-label">{totalQuantity}</span>
                      </div>
                    );
                  })()}
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
