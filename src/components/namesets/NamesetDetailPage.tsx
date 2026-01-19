import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRouteData } from '../../hooks/useRouteData';
import { useArchivedKitTypes, useArchivedNamesets, useKitTypesList, useNamesetsList, useNamesetsLoading } from '../../stores';
import { useAuth } from '../../stores/authStore';
import { Nameset } from '../../types';
import { getKitTypeInfo } from '../../utils/utils';
import EditNamesetModal from './EditNamesetModal';
import './NamesetDetailPage.css';
import NamesetImageManager from './NamesetImageManager';

const NamesetDetailPage: React.FC = () => {
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
  const activeNamesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();
  const isLoading = useNamesetsLoading();

  const [nameset, setNameset] = useState<Nameset | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Navigation handler - defined early to avoid hoisting issues
  const handleBack = () => {
    // Stay in the same context (public or admin)
    if (isPublicRoute) {
      navigate('/products');
    } else {
      navigate('/admin/namesets');
    }
  };

  // Find the nameset (check both active and archived)
  useEffect(() => {
    if (id) {
      const foundNameset = activeNamesets.find((n) => n.id === id) || archivedNamesets.find((n) => n.id === id);
      setNameset(foundNameset || null);
    }
  }, [id, activeNamesets, archivedNamesets]);

  // Show loading state if data is loading and nameset is not yet found
  if (isLoading && !nameset) {
    return (
      <div className="nameset-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading nameset details...</p>
        </div>
      </div>
    );
  }

  if (!nameset) {
    return (
      <div className="nameset-detail-page">
        <div className="card">
          <div className="card-header">
            <h2>Nameset Not Found</h2>
          </div>
          <div className="card-content">
            <p>The requested nameset could not be found.</p>
            <button onClick={handleBack} className="btn btn-primary">
              Back to Namesets
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if nameset is out of stock
  const isOutOfStock = nameset.quantity === 0;

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

  const handleEditClose: React.Dispatch<React.SetStateAction<Nameset | null>> = (nameset) => {
    setIsEditing(false);
    // The useEffect will automatically refresh the nameset when activeNamesets/archivedNamesets update
  };

  return (
    <div className={`nameset-detail-page ${isPublicRoute ? 'public-mode' : ''}`}>
      {/* Header */}
      <div className="nameset-detail-header">
        <button onClick={handleBack} className="btn btn-secondary">
          ← Back to Namesets
        </button>
        {showAdminFeatures && (
          <button onClick={handleEditClick} className="btn btn-primary admin-only">
            Edit Nameset
          </button>
        )}
      </div>

      <div className="nameset-detail-content">
        {/* Nameset Images */}
        <div className="nameset-images-section">
          <div className="card">
            <div className="card-header">
              <h3>Nameset Images</h3>
            </div>
            <div className="card-content">
              <NamesetImageManager namesetId={nameset.id} isAdmin={showAdminFeatures} />
            </div>
          </div>
        </div>

        {/* Nameset Details */}
        <div className="nameset-details-section">
          <div className="card">
            <div className="card-header">
              <h2>
                {nameset.playerName} #{nameset.number}
              </h2>
              {isOutOfStock && <span className="out-of-stock-badge">OUT OF STOCK</span>}
            </div>
            <div className="card-content">
              <div className="nameset-details-grid">
                <div className="detail-item">
                  <label>Player Name:</label>
                  <span>{nameset.playerName}</span>
                </div>
                <div className="detail-item">
                  <label>Number:</label>
                  <span>#{nameset.number}</span>
                </div>
                <div className="detail-item">
                  <label>Season:</label>
                  <span>{nameset.season}</span>
                </div>
                <div className="detail-item">
                  <label>Kit Type:</label>
                  <span>{getKitTypeInfo(nameset.kitTypeId, kitTypes, archivedKitTypes)}</span>
                </div>
                <div className="detail-item">
                  <label>Quantity:</label>
                  <span className={isOutOfStock ? 'out-of-stock' : 'in-stock'}>
                    {isPublicRoute ? getStockStatus(nameset.quantity) : nameset.quantity}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Price:</label>
                  <span className="price-display">{nameset.price.toFixed(2)} RON</span>
                </div>
                {!isPublicRoute && (
                  <div className="detail-item">
                    <label>Created:</label>
                    <span>{new Date(nameset.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                {showAdminFeatures && (
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{nameset.location || '-'}</span>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="stock-section">
                <h4>Stock Status</h4>
                <div className="stock-grid">
                  <div
                    className={`stock-item ${isOutOfStock ? 'out-of-stock' : nameset.quantity <= 2 ? 'low-stock' : 'in-stock'}`}
                  >
                    <span className="stock-label">Available</span>
                    <span className="quantity-label">
                      {isPublicRoute ? getStockStatus(nameset.quantity) : nameset.quantity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && <EditNamesetModal editingNameset={nameset} setEditingNameset={handleEditClose} />}
    </div>
  );
};

export default NamesetDetailPage;
