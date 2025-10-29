import React from 'react';
import { useErrorToast } from '../../hooks/useErrorToast';
import { useOrdersActions } from '../../stores';
import { Order, OrderStatus } from '../../types';

interface OrdersTableListProps {
  orders: Order[];
  onDelete?: (id: string) => void;
  searchTerm?: string;
  isReadOnly?: boolean;
}

const OrdersTableList: React.FC<OrdersTableListProps> = ({ orders, onDelete, searchTerm = '', isReadOnly = false }) => {
  const { updateOrderStatus, archiveOrder } = useOrdersActions();
  const { showError } = useErrorToast();

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to update order status');
    }
  };

  const handleArchive = async (orderId: string) => {
    try {
      if (onDelete) {
        onDelete(orderId);
      } else {
        await archiveOrder(orderId);
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to archive order');
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.TO_ORDER:
        return '#f59e0b'; // amber
      case OrderStatus.ORDERED:
        return '#3b82f6'; // blue
      case OrderStatus.RECEIVED:
        return '#10b981'; // emerald
      case OrderStatus.MESSAGE_SENT:
        return '#8b5cf6'; // violet
      case OrderStatus.FINISHED:
        return '#6b7280'; // gray
      default:
        return '#6b7280';
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(
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
        <p>
          {searchTerm
            ? `No orders found matching "${searchTerm}".`
            : 'No orders found. Add your first order to get started.'}
        </p>
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
            <th>Team</th>
            <th>Status</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Price</th>
            <th>Created</th>
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
              <td>{order.teamId || '-'}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  style={{
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                  }}
                >
                  {Object.values(OrderStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>{order.customerName || '-'}</td>
              <td>{order.phoneNumber || '-'}</td>
              <td>${order.price.toFixed(2)}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => handleArchive(order.id)}
                    className="btn btn-secondary btn-sm"
                    title="Archive Order"
                  >
                    Archive
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

export default OrdersTableList;
