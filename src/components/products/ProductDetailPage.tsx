import React, { useEffect, useState } from 'react';
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

  // Find the product (check both active and archived)
  useEffect(() => {
    if (id) {
      const foundProduct = activeProducts.find((p) => p.id === id) || archivedProducts.find((p) => p.id === id);
      setProduct(foundProduct || null);
    }
  }, [id, activeProducts, archivedProducts]);

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
                  <span className="price-display">${product.price.toFixed(2)}</span>
                </div>
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
                <div className="detail-item">
                  <label>Badge:</label>
                  <span>{badgeInfo}</span>
                </div>
                {!isPublicRoute && (
                  <div className="detail-item">
                    <label>Created:</label>
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
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
      {isEditing && <EditProductModal editingProduct={product} setEditingProduct={() => setIsEditing(false)} />}
    </div>
  );
};

export default ProductDetailPage;
