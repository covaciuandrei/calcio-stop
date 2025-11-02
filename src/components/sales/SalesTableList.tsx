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
import { Sale } from '../../types';
import { getProductDisplayText, getProductInfo } from '../../utils/utils';

interface Props {
  sales: Sale[];
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
  searchTerm?: string;
}

const SalesTableList: React.FC<Props> = ({ sales, onEdit, onDelete, searchTerm = '' }) => {
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

  // Calculate total for a sale
  const getSaleTotal = (sale: Sale): number => {
    return sale.items.reduce((total, item) => total + item.priceSold * item.quantity, 0);
  };

  // Filter sales based on search term
  const filteredSales = sales.filter((sale) => {
    const matchesItems = sale.items.some((item) => {
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
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.saleType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (sales.length === 0) {
    return <p>No sales recorded.</p>;
  }

  if (filteredSales.length === 0 && searchTerm) {
    return <p>No sales found matching "{searchTerm}".</p>;
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
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((s) => (
            <tr key={s.id}>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {s.items.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.875rem' }}>
                      {getProductDetails(item.productId)} - Size: {item.size} - Qty: {item.quantity} -{' '}
                      {item.priceSold.toFixed(2)} RON
                    </div>
                  ))}
                </div>
              </td>
              <td className="price-display">{getSaleTotal(s).toFixed(2)} RON</td>
              <td>{s.customerName || 'N/A'}</td>
              <td>{s.saleType}</td>
              <td>{new Date(s.date).toLocaleString()}</td>
              <td>
                <button onClick={() => onEdit(s)} className="btn btn-icon btn-success" title="Edit">
                  ✏️
                </button>
                <button onClick={() => onDelete(s.id)} className="btn btn-icon btn-danger" title="Delete">
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card Layout */}
      <div className="mobile-table-cards">
        {filteredSales.map((s) => (
          <div key={s.id} className="mobile-table-card">
            <div className="mobile-card-header">
              <div className="mobile-card-title">
                <h4>
                  {s.items.length} Item{s.items.length !== 1 ? 's' : ''}
                </h4>
                <p className="mobile-card-subtitle">{s.saleType}</p>
              </div>
              <div className="mobile-card-price">{getSaleTotal(s).toFixed(2)} RON</div>
            </div>

            <div className="mobile-card-details">
              <div className="mobile-detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="mobile-detail-label">Items</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                  {s.items.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.875rem' }}>
                      {getProductDetails(item.productId)} - {item.size} x{item.quantity} - {item.priceSold.toFixed(2)}{' '}
                      RON
                    </div>
                  ))}
                </div>
              </div>
              <div className="mobile-detail-item">
                <span className="mobile-detail-label">Customer</span>
                <span className="mobile-detail-value">{s.customerName || 'N/A'}</span>
              </div>
              <div className="mobile-detail-item">
                <span className="mobile-detail-label">Date</span>
                <span className="mobile-detail-value">{new Date(s.date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mobile-card-status">
              <div className="mobile-card-actions">
                <button onClick={() => onEdit(s)} className="btn btn-success" title="Edit">
                  Edit
                </button>
                <button onClick={() => onDelete(s.id)} className="btn btn-danger" title="Delete">
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

export default SalesTableList;
