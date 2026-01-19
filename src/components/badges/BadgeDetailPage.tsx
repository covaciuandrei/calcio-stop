import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRouteData } from '../../hooks/useRouteData';
import { useArchivedBadges, useBadgesList, useBadgesLoading } from '../../stores';
import { useAuth } from '../../stores/authStore';
import { Badge } from '../../types';
import './BadgeDetailPage.css';
import BadgeImageManager from './BadgeImageManager';
import EditBadgeModal from './EditBadgeModal';

const BadgeDetailPage: React.FC = () => {
  // Load data for this route (essential for direct page access/refresh)
  useRouteData();
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Check if this is a public route (not an admin route)
  const isPublicRoute = !location.pathname.startsWith('/admin');
  const isAdmin = user?.role === 'admin' && isAuthenticated;
  const showAdminFeatures = isAdmin && !isPublicRoute;

  // Get data from stores
  const activeBadges = useBadgesList();
  const archivedBadges = useArchivedBadges();
  const isLoading = useBadgesLoading();

  const [badge, setBadge] = useState<Badge | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Navigation handler - defined early to avoid hoisting issues
  const handleBack = () => {
    // Stay in the same context (public or admin)
    if (isPublicRoute) {
      navigate('/badges');
    } else {
      navigate('/admin/badges');
    }
  };

  // Find the badge (check both active and archived)
  useEffect(() => {
    if (id) {
      const foundBadge = activeBadges.find((b) => b.id === id) || archivedBadges.find((b) => b.id === id);
      setBadge(foundBadge || null);
    }
  }, [id, activeBadges, archivedBadges]);

  // Show loading state if data is loading and badge is not yet found
  if (isLoading && !badge) {
    return (
      <div className="badge-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading badge details...</p>
        </div>
      </div>
    );
  }

  if (!badge) {
    return (
      <div className="badge-detail-page">
        <div className="card">
          <div className="card-header">
            <h2>Badge Not Found</h2>
          </div>
          <div className="card-content">
            <p>The requested badge could not be found.</p>
            <button onClick={handleBack} className="btn btn-primary">
              Back to Badges
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if badge is out of stock
  const isOutOfStock = badge.quantity === 0;

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
    // The useEffect will automatically refresh the badge when activeBadges/archivedBadges update
  };

  return (
    <div className={`badge-detail-page ${isPublicRoute ? 'public-mode' : ''}`}>
      {/* Header */}
      <div className="badge-detail-header">
        <button onClick={handleBack} className="btn btn-secondary">
          ← Back to Badges
        </button>
        {showAdminFeatures && (
          <button onClick={handleEditClick} className="btn btn-primary admin-only">
            Edit Badge
          </button>
        )}
      </div>

      <div className="badge-detail-content">
        {/* Badge Images */}
        <div className="badge-images-section">
          <div className="card">
            <div className="card-header">
              <h3>Badge Images</h3>
            </div>
            <div className="card-content">
              <BadgeImageManager badgeId={badge.id} isAdmin={showAdminFeatures} />
            </div>
          </div>
        </div>

        {/* Badge Details */}
        <div className="badge-details-section">
          <div className="card">
            <div className="card-header">
              <h2>{badge.name || 'Unnamed Badge'}</h2>
              {isOutOfStock && <span className="out-of-stock-badge">OUT OF STOCK</span>}
            </div>
            <div className="card-content">
              <div className="badge-details-grid">
                <div className="detail-item">
                  <label>Name:</label>
                  <span>{badge.name}</span>
                </div>
                <div className="detail-item">
                  <label>Season:</label>
                  <span>{badge.season}</span>
                </div>
                <div className="detail-item">
                  <label>Quantity:</label>
                  <span className={isOutOfStock ? 'out-of-stock' : 'in-stock'}>
                    {isPublicRoute ? getStockStatus(badge.quantity) : badge.quantity}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Price:</label>
                  <span className="price-display">{badge.price.toFixed(2)} RON</span>
                </div>
                {!isPublicRoute && (
                  <div className="detail-item">
                    <label>Created:</label>
                    <span>{new Date(badge.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                {showAdminFeatures && (
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{badge.location || '-'}</span>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="stock-section">
                <h4>Stock Status</h4>
                <div className="stock-grid">
                  <div
                    className={`stock-item ${isOutOfStock ? 'out-of-stock' : badge.quantity <= 2 ? 'low-stock' : 'in-stock'}`}
                  >
                    <span className="stock-label">Available</span>
                    <span className="quantity-label">
                      {isPublicRoute ? getStockStatus(badge.quantity) : badge.quantity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && <EditBadgeModal editingBadge={badge} setEditingBadge={handleEditClose} />}
    </div>
  );
};

export default BadgeDetailPage;
