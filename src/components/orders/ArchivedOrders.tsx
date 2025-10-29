import React from 'react';
import { useErrorToast } from '../../hooks/useErrorToast';
import { useOrdersActions } from '../../stores';
import { Order } from '../../types';

interface ArchivedOrdersProps {
  archivedOrders: Order[];
  searchTerm: string;
  onClearSearch: () => void;
}

const ArchivedOrders: React.FC<ArchivedOrdersProps> = ({ archivedOrders, searchTerm, onClearSearch }) => {
  const { unarchiveOrder } = useOrdersActions();
  const { showError } = useErrorToast();

  const handleUnarchive = async (orderId: string) => {
    try {
      await unarchiveOrder(orderId);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to unarchive order');
    }
  };

  // Filter orders based on search term
  const filteredOrders = archivedOrders.filter(
    (order) =>
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.phoneNumber && order.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredOrders.length === 0) {
    return (
      <div className="empty-state">
        {searchTerm ? (
          <>
            No archived orders found matching "{searchTerm}".{' '}
            <button onClick={onClearSearch} className="link-button">
              Clear search
            </button>
          </>
        ) : (
          'No archived orders available.'
        )}
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Price</th>
            <th>Archived</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>
                <div className="order-name">{order.name}</div>
              </td>
              <td>{order.type}</td>
              <td>
                <span className="status-badge" style={{ backgroundColor: '#6b7280', color: 'white' }}>
                  {order.status}
                </span>
              </td>
              <td>{order.customerName || '-'}</td>
              <td>{order.phoneNumber || '-'}</td>
              <td>${order.price.toFixed(2)}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => handleUnarchive(order.id)}
                    className="btn btn-secondary btn-sm"
                    title="Unarchive Order"
                  >
                    Unarchive
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArchivedOrders;
