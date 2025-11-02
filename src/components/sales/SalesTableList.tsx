import React from 'react';
import {
  useArchivedBadges,
  useArchivedNamesets,
  useArchivedProducts,
  useBadgesList,
  useNamesetsList,
  useProductsList,
} from '../../stores';
import { Sale } from '../../types';
import { getBadgeInfo, getNamesetInfo, getProductInfo } from '../../utils/utils';

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
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();
  const getProductDetails = (productId: string) => {
    const product = getProductInfo(productId, products, archivedProducts);

    if (!product) return 'Unknown product';
    const namesetInfo = getNamesetInfo(product.namesetId, namesets, archivedNamesets);
    const badgeInfo = getBadgeInfo(product.badgeId, badges, archivedBadges);
    const badgeText = badgeInfo !== '-' ? ` (${badgeInfo})` : '';
    return `${product.name} - ${product.type} - ${namesetInfo.playerName} #${
      namesetInfo.number > 0 ? namesetInfo.number : '-'
    }${badgeText}`;
  };

  // Filter sales based on search term
  const filteredSales = sales.filter((sale) => {
    const productDetails = getProductDetails(sale.productId);
    return (
      productDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.quantity.toString().includes(searchTerm) ||
      sale.priceSold.toString().includes(searchTerm) ||
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
            <th>Product</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Price Sold (RON)</th>
            <th>Customer</th>
            <th>Sale Type</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((s) => (
            <tr key={s.id}>
              <td>{getProductDetails(s.productId)}</td>
              <td>{s.size}</td>
              <td>{s.quantity}</td>
              <td className="price-display">{s.priceSold ? s.priceSold.toFixed(2) : '0.00'} RON</td>
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
                <h4>{getProductDetails(s.productId)}</h4>
                <p className="mobile-card-subtitle">{s.saleType}</p>
              </div>
              <div className="mobile-card-price">{s.priceSold ? s.priceSold.toFixed(2) : '0.00'} RON</div>
            </div>

            <div className="mobile-card-details">
              <div className="mobile-detail-item">
                <span className="mobile-detail-label">Size</span>
                <span className="mobile-detail-value">{s.size}</span>
              </div>
              <div className="mobile-detail-item">
                <span className="mobile-detail-label">Quantity</span>
                <span className="mobile-detail-value">{s.quantity}</span>
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
