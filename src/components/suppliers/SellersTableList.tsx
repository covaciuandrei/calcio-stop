import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
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
import { Seller } from '../../types';
import { getProductDisplayText } from '../../utils/utils';

interface Props {
  sellers: Seller[];
  onEdit: (s: Seller) => void;
  onDelete?: (id: string) => void;
  onArchive: (id: string) => void;
  searchTerm?: string;
  isReadOnly?: boolean;
  products?: any[]; // Products list for displaying product names
}

const SellersTableList: React.FC<Props> = ({
  sellers,
  onEdit,
  onDelete,
  onArchive,
  searchTerm = '',
  isReadOnly = false,
  products = [],
}) => {
  const navigate = useNavigate();
  const [selectedSellerProducts, setSelectedSellerProducts] = useState<{
    sellerName: string;
    productIds: string[];
  } | null>(null);

  // Get related data for product display
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();

  // Filter sellers based on search term
  const normalizedSearch = searchTerm.toLowerCase();
  const filteredSellers = sellers.filter((seller) => {
    if ((seller.name || '').toLowerCase().includes(normalizedSearch)) return true;
    if ((seller.websiteUrl || '').toLowerCase().includes(normalizedSearch)) return true;
    if ((seller.specialNotes || '').toLowerCase().includes(normalizedSearch)) return true;
    if (seller.productIds && seller.productIds.length > 0) {
      const hasMatchingProduct = seller.productIds.some((id) => {
        const product = products.find((p) => p.id === id);
        if (!product) return false;
        const displayText = getProductDisplayText(
          product,
          namesets,
          archivedNamesets,
          teams,
          archivedTeams,
          badges,
          archivedBadges,
          kitTypes,
          archivedKitTypes
        );
        return displayText.toLowerCase().includes(normalizedSearch);
      });
      if (hasMatchingProduct) return true;
    }
    return false;
  });

  if (sellers.length === 0) {
    return <p>No sellers available.</p>;
  }

  if (filteredSellers.length === 0 && searchTerm) {
    return <p>No sellers found matching "{searchTerm}".</p>;
  }

  const getProductNames = (productIds: string[]) => {
    const productNames = productIds
      .map((id) => {
        const product = products.find((p) => p.id === id);
        return product ? product.name : null;
      })
      .filter(Boolean);
    return productNames.length > 0 ? productNames.join(', ') : 'No products';
  };

  const handleProductsClick = (seller: Seller, e: React.MouseEvent) => {
    e.stopPropagation();
    if (seller.productIds.length > 0) {
      setSelectedSellerProducts({ sellerName: seller.name, productIds: seller.productIds });
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
    setSelectedSellerProducts(null);
  };

  const getSellerProducts = () => {
    if (!selectedSellerProducts) return [];
    return selectedSellerProducts.productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  };

  return (
    <>
      {/* Desktop Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th style={{ maxWidth: '200px' }}>Website</th>
            <th style={{ maxWidth: '200px' }}>Special Notes</th>
            <th>Products</th>
            {!isReadOnly && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredSellers.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td style={{ maxWidth: '200px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {s.websiteUrl ? (
                  <a
                    href={s.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ wordBreak: 'break-all', overflowWrap: 'break-word', display: 'block' }}
                  >
                    {s.websiteUrl}
                  </a>
                ) : (
                  '-'
                )}
              </td>
              <td style={{ maxWidth: '200px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {s.specialNotes ? (
                  <span
                    title={s.specialNotes}
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      display: 'block',
                      whiteSpace: 'normal',
                    }}
                  >
                    {s.specialNotes}
                  </span>
                ) : (
                  '-'
                )}
              </td>
              <td>
                {s.productIds.length > 0 ? (
                  <span
                    onClick={(e) => handleProductsClick(s, e)}
                    title={getProductNames(s.productIds)}
                    style={{
                      cursor: 'pointer',
                      color: 'var(--primary-600)',
                      textDecoration: 'underline',
                      fontWeight: 500,
                    }}
                  >
                    {s.productIds.length} product{s.productIds.length !== 1 ? 's' : ''}
                  </span>
                ) : (
                  'No products'
                )}
              </td>
              {!isReadOnly && (
                <td onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onEdit(s)} className="btn btn-icon btn-success" title="Edit">
                    ✏️
                  </button>
                  <button onClick={() => onArchive(s.id)} className="btn btn-icon btn-secondary" title="Archive">
                    📦
                  </button>
                  {onDelete && (
                    <button onClick={() => onDelete(s.id)} className="btn btn-icon btn-danger" title="Delete">
                      🗑️
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card Layout */}
      <div className="mobile-table-cards">
        {filteredSellers.map((s) => (
          <div key={s.id} className="mobile-table-card">
            <div className="mobile-card-header">
              <div className="mobile-card-title">
                <h4>{s.name}</h4>
              </div>
            </div>

            <div className="mobile-card-details">
              {s.websiteUrl && (
                <div className="mobile-detail-item">
                  <span className="mobile-detail-label">Website</span>
                  <span className="mobile-detail-value" style={{ wordBreak: 'break-word', maxWidth: '100%' }}>
                    <a href={s.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                      {s.websiteUrl}
                    </a>
                  </span>
                </div>
              )}
              {s.specialNotes && (
                <div className="mobile-detail-item">
                  <span className="mobile-detail-label">Special Notes</span>
                  <span className="mobile-detail-value">{s.specialNotes}</span>
                </div>
              )}
              <div className="mobile-detail-item">
                <span className="mobile-detail-label">Products</span>
                <span
                  className="mobile-detail-value"
                  title={getProductNames(s.productIds)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductsClick(s, e);
                  }}
                  style={{
                    cursor: s.productIds.length > 0 ? 'pointer' : 'default',
                    color: s.productIds.length > 0 ? 'var(--primary-600)' : 'inherit',
                    textDecoration: s.productIds.length > 0 ? 'underline' : 'none',
                  }}
                >
                  {s.productIds.length > 0
                    ? `${s.productIds.length} product${s.productIds.length !== 1 ? 's' : ''}`
                    : 'No products'}
                </span>
              </div>
            </div>

            {!isReadOnly && (
              <div className="mobile-card-actions" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onEdit(s)} className="btn btn-success" title="Edit">
                  Edit
                </button>
                <button onClick={() => onArchive(s.id)} className="btn btn-secondary" title="Archive">
                  Archive
                </button>
                {onDelete && (
                  <button onClick={() => onDelete(s.id)} className="btn btn-danger" title="Delete">
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Products Modal */}
      {selectedSellerProducts &&
        createPortal(
          <div className="modal" onClick={() => setSelectedSellerProducts(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div className="modal-header">
                <h2>Products from {selectedSellerProducts.sellerName}</h2>
                <button className="modal-close" onClick={() => setSelectedSellerProducts(null)}>
                  ×
                </button>
              </div>
              <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {getSellerProducts().length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {getSellerProducts().map((product) => {
                      const productDisplayText = getProductDisplayText(
                        product,
                        namesets,
                        archivedNamesets,
                        teams,
                        archivedTeams,
                        badges,
                        archivedBadges,
                        kitTypes,
                        archivedKitTypes
                      );
                      return (
                        <li
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          style={{
                            padding: 'var(--space-3)',
                            marginBottom: 'var(--space-2)',
                            border: '1px solid var(--gray-200)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-normal)',
                            background: 'var(--gray-50)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--primary-50)';
                            e.currentTarget.style.borderColor = 'var(--primary-300)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--gray-50)';
                            e.currentTarget.style.borderColor = 'var(--gray-200)';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <div style={{ fontWeight: 500, color: 'var(--gray-900)', marginBottom: 'var(--space-1)' }}>
                            {productDisplayText}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                            Price: {product.price?.toFixed(2) || '0.00'} RON
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>No products found.</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedSellerProducts(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default SellersTableList;
