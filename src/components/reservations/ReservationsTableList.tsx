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
import { Reservation } from '../../types';
import { formatDate, getProductDisplayText, getProductInfo } from '../../utils/utils';

interface Props {
  reservations: Reservation[];
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string, status: 'pending' | 'completed') => void;
  onComplete: (id: string) => void;
  searchTerm?: string;
}

const ReservationsTableList: React.FC<Props> = ({ reservations, onEdit, onDelete, onComplete, searchTerm = '' }) => {
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

  // Calculate total for a reservation
  const getReservationTotal = (reservation: Reservation): number => {
    return reservation.items.reduce((total, item) => total + item.priceSold * item.quantity, 0);
  };

  // Check if reservation is expired
  const isExpired = (reservation: Reservation): boolean => {
    if (reservation.status === 'completed') return false;
    const now = new Date();
    const expiringDate = new Date(reservation.expiringDate);
    return expiringDate < now;
  };

  // Filter reservations based on search term
  const filteredReservations = reservations.filter((reservation) => {
    const matchesItems = reservation.items.some((item) => {
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
      reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (reservations.length === 0) {
    return <p>No reservations recorded.</p>;
  }

  if (filteredReservations.length === 0 && searchTerm) {
    return <p>No reservations found matching "{searchTerm}".</p>;
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
            <th>Status</th>
            <th>Expiring Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((r) => {
            const expired = isExpired(r);
            return (
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
                <td className="price-display">{getReservationTotal(r).toFixed(2)} RON</td>
                <td>{r.customerName || 'N/A'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        backgroundColor: r.status === 'completed' ? '#10b981' : '#f59e0b',
                        color: 'white',
                      }}
                    >
                      {r.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                    {expired && (
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          backgroundColor: '#ef4444',
                          color: 'white',
                        }}
                      >
                        Expired
                      </span>
                    )}
                  </div>
                </td>
                <td>{formatDate(r.expiringDate)}</td>
                <td>
                  {r.status === 'pending' && (
                    <button onClick={() => onComplete(r.id)} className="btn btn-icon btn-success" title="Complete">
                      ✓
                    </button>
                  )}
                  {r.status === 'pending' && (
                    <button onClick={() => onEdit(r)} className="btn btn-icon btn-primary" title="Edit">
                      ✏️
                    </button>
                  )}
                  <button onClick={() => onDelete(r.id, r.status)} className="btn btn-icon btn-danger" title="Delete">
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile Card Layout */}
      <div className="mobile-table-cards">
        {filteredReservations.map((r) => {
          const expired = isExpired(r);
          return (
            <div key={r.id} className="mobile-table-card">
              <div className="mobile-card-header">
                <div className="mobile-card-title">
                  <h4>
                    {r.items.length} Item{r.items.length !== 1 ? 's' : ''}
                  </h4>
                  <div
                    style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}
                  >
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        backgroundColor: r.status === 'completed' ? '#10b981' : '#f59e0b',
                        color: 'white',
                      }}
                    >
                      {r.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                    {expired && (
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          backgroundColor: '#ef4444',
                          color: 'white',
                        }}
                      >
                        Expired
                      </span>
                    )}
                  </div>
                </div>
                <div className="mobile-card-price">{getReservationTotal(r).toFixed(2)} RON</div>
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
                  <span className="mobile-detail-label">Expiring Date</span>
                  <span className="mobile-detail-value">{formatDate(r.expiringDate)}</span>
                </div>
              </div>

              <div className="mobile-card-status">
                <div className="mobile-card-actions">
                  {r.status === 'pending' && (
                    <button onClick={() => onComplete(r.id)} className="btn btn-success" title="Complete">
                      Complete
                    </button>
                  )}
                  {r.status === 'pending' && (
                    <button onClick={() => onEdit(r)} className="btn btn-primary" title="Edit">
                      Edit
                    </button>
                  )}
                  <button onClick={() => onDelete(r.id, r.status)} className="btn btn-danger" title="Delete">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ReservationsTableList;
