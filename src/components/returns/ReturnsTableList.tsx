import React from 'react';
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
import { Return } from '../../types';
import { getProductDisplayText, getProductInfo } from '../../utils/utils';

interface Props {
  returns: Return[];
  onDelete: (id: string) => void;
  searchTerm?: string;
}

const ReturnsTableList: React.FC<Props> = ({ returns, onDelete, searchTerm = '' }) => {
  // Get data from stores
  const products = useProductsList();
  const archivedProducts = useArchivedProducts();
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();

  const getProductDetails = (productId: string) => {
    const product = getProductInfo(productId, products, archivedProducts);

    if (!product) return 'Unknown product';

    return getProductDisplayText(
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
  };

  // Calculate total for a return
  const getReturnTotal = (returnRecord: Return): number => {
    return returnRecord.items.reduce((total, item) => total + item.priceSold * item.quantity, 0);
  };

  // Filter returns based on search term
  const filteredReturns = returns.filter((returnRecord) => {
    const matchesItems = returnRecord.items.some((item) => {
      const productDetails = getProductDetails(item.productId);
      return (
        productDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.quantity.toString().includes(searchTerm) ||
        item.priceSold.toString().includes(searchTerm)
      );
    });
    return (
      matchesItems ||
      returnRecord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnRecord.saleType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (returns.length === 0) {
    return <p>No returns recorded.</p>;
  }

  if (filteredReturns.length === 0 && searchTerm) {
    return <p>No returns found matching "{searchTerm}".</p>;
  }

  return (
    <>
      {/* Desktop Table */}
      <table>
        <thead>
          <tr>
            <th>Items</th>
            <th>Total (RON)</th>
            <th>Customer</th>
            <th>Sale Type</th>
            <th>Sale Date</th>
            <th>Returned At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReturns.map((r) => (
            <tr key={r.id}>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {r.items.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.875rem' }}>
                      {getProductDetails(item.productId)} - Size: {item.size} - Qty: {item.quantity} -{' '}
                      {item.priceSold.toFixed(2)} RON
                    </div>
                  ))}
                </div>
              </td>
              <td className="price-display">{getReturnTotal(r).toFixed(2)} RON</td>
              <td>{r.customerName || 'N/A'}</td>
              <td>{r.saleType}</td>
              <td>{new Date(r.date).toLocaleString()}</td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => onDelete(r.id)} className="btn btn-icon btn-danger" title="Delete">
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card Layout */}
      <div className="mobile-table-cards">
        {filteredReturns.map((r) => (
          <div key={r.id} className="mobile-table-card">
            <div className="mobile-card-header">
              <div className="mobile-card-title">
                <h4>
                  {r.items.length} Item{r.items.length !== 1 ? 's' : ''}
                </h4>
                <p className="mobile-card-subtitle">{r.saleType}</p>
              </div>
              <div className="mobile-card-price">{getReturnTotal(r).toFixed(2)} RON</div>
            </div>

            <div className="mobile-card-details">
              <div className="mobile-detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="mobile-detail-label">Items</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                  {r.items.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.875rem' }}>
                      {getProductDetails(item.productId)} - {item.size} x{item.quantity} - {item.priceSold.toFixed(2)}{' '}
                      RON
                    </div>
                  ))}
                </div>
              </div>
              <div className="mobile-detail-item">
                <span className="mobile-detail-label">Customer</span>
                <span className="mobile-detail-value">{r.customerName || 'N/A'}</span>
              </div>
              <div className="mobile-detail-item">
                <span className="mobile-detail-label">Sale Date</span>
                <span className="mobile-detail-value">{new Date(r.date).toLocaleString()}</span>
              </div>
              <div className="mobile-detail-item">
                <span className="mobile-detail-label">Returned At</span>
                <span className="mobile-detail-value">{new Date(r.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="mobile-card-status">
              <div className="mobile-card-actions">
                <button onClick={() => onDelete(r.id)} className="btn btn-danger" title="Delete">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReturnsTableList;
