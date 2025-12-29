import React from 'react';
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
import { ProductLink } from '../../types';
import { getKitTypeInfo, getTeamInfo } from '../../utils/utils';

interface Props {
  productLinks: ProductLink[];
  onEdit: (pl: ProductLink) => void;
  onDelete?: (id: string) => void;
  searchTerm?: string;
  isReadOnly?: boolean;
  products?: any[]; // Products list for displaying product names
  sellers?: any[]; // Sellers list for displaying seller names
}

const ProductLinksTableList: React.FC<Props> = ({
  productLinks,
  onEdit,
  onDelete,
  searchTerm = '',
  isReadOnly = false,
  products = [],
  sellers = [],
}) => {
  const navigate = useNavigate();

  // Get related data for product display
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();

  // Filter product links based on search term
  const filteredProductLinks = productLinks.filter((pl) => {
    const product = products.find((p) => p.id === pl.productId);
    const seller = sellers.find((s) => s.id === pl.sellerId);
    const teamName = getTeamInfo(product?.teamId || null, teams, archivedTeams);

    return (
      (product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (seller?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pl.label || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pl.url || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      teamName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (productLinks.length === 0) {
    return <p>No product links available.</p>;
  }

  if (filteredProductLinks.length === 0 && searchTerm) {
    return <p>No product links found matching "{searchTerm}".</p>;
  }

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getProductDetails = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return {
        team: '-',
        notes: 'Unknown Product',
        type: '-',
        kitType: '-',
      };
    }

    return {
      team: getTeamInfo(product.teamId, teams, archivedTeams),
      notes: product.name || '-',
      type: product.type || '-',
      kitType: getKitTypeInfo(product.kitTypeId, kitTypes, archivedKitTypes),
    };
  };

  const getSellerName = (sellerId?: string) => {
    if (!sellerId) return null;
    const seller = sellers.find((s) => s.id === sellerId);
    return seller ? seller.name : 'Unknown Seller';
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <>
      {/* Desktop Table */}
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Seller</th>
            <th>Label</th>
            <th>URL</th>
            {!isReadOnly && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProductLinks.map((pl) => {
            const productDetails = getProductDetails(pl.productId);
            return (
              <tr key={pl.id}>
                <td style={{ maxWidth: '300px', wordBreak: 'break-word' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleProductClick(pl.productId);
                      }}
                      style={{ color: 'var(--primary-600)', textDecoration: 'underline', fontWeight: 500 }}
                    >
                      {productDetails.notes}
                    </a>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--gray-600)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      {productDetails.team !== '-' && (
                        <span>
                          <strong>Team:</strong> {productDetails.team}
                        </span>
                      )}
                      {productDetails.notes && productDetails.notes !== '-' && (
                        <span>
                          <strong>Notes:</strong> {productDetails.notes}
                        </span>
                      )}
                      <span>
                        <strong>Type:</strong> {productDetails.type}
                      </span>
                      {productDetails.kitType !== '-' && (
                        <span>
                          <strong>Kit Type:</strong> {productDetails.kitType}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td>{getSellerName(pl.sellerId) || '-'}</td>
                <td>{pl.label || '-'}</td>
                <td>
                  <a href={pl.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    {pl.url}
                  </a>
                </td>
                {!isReadOnly && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEdit(pl)} className="btn btn-icon btn-success" title="Edit">
                      ✏️
                    </button>
                    {onDelete && (
                      <button onClick={() => onDelete(pl.id)} className="btn btn-icon btn-danger" title="Delete">
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
        {filteredProductLinks.map((pl) => {
          const sellerName = getSellerName(pl.sellerId);
          const productDetails = getProductDetails(pl.productId);
          return (
            <div key={pl.id} className="mobile-table-card">
              <div className="mobile-card-header">
                <div className="mobile-card-title">
                  <h4>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleProductClick(pl.productId);
                      }}
                      style={{ color: 'var(--primary-600)', textDecoration: 'underline' }}
                    >
                      {productDetails.notes}
                    </a>
                  </h4>
                  {pl.label && <p className="mobile-card-subtitle">{pl.label}</p>}
                </div>
              </div>

              <div className="mobile-card-details">
                {productDetails.team !== '-' && (
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Team</span>
                    <span className="mobile-detail-value">{productDetails.team}</span>
                  </div>
                )}
                {productDetails.notes && productDetails.notes !== '-' && (
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Notes</span>
                    <span className="mobile-detail-value">{productDetails.notes}</span>
                  </div>
                )}
                <div className="mobile-detail-item">
                  <span className="mobile-detail-label">Type</span>
                  <span className="mobile-detail-value">{productDetails.type}</span>
                </div>
                {productDetails.kitType !== '-' && (
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Kit Type</span>
                    <span className="mobile-detail-value">{productDetails.kitType}</span>
                  </div>
                )}
                {sellerName && (
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Seller</span>
                    <span className="mobile-detail-value">{sellerName}</span>
                  </div>
                )}
                <div className="mobile-detail-item">
                  <span className="mobile-detail-label">URL</span>
                  <span className="mobile-detail-value">
                    <a href={pl.url} target="_blank" rel="noopener noreferrer">
                      {pl.url}
                    </a>
                  </span>
                </div>
              </div>

              {!isReadOnly && (
                <div className="mobile-card-actions" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onEdit(pl)} className="btn btn-success" title="Edit">
                    Edit
                  </button>
                  {onDelete && (
                    <button onClick={() => onDelete(pl.id)} className="btn btn-danger" title="Delete">
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProductLinksTableList;
