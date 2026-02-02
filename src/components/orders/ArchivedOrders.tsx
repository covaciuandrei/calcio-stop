import React, { useState } from 'react';
import { useErrorToast } from '../../hooks/useErrorToast';
import { useOrdersActions } from '../../stores';
import { Order, OrderStatus, OrderItem } from '../../types';

interface ArchivedOrdersProps {
  archivedOrders: Order[];
  searchTerm: string;
  onClearSearch: () => void;
}

const ArchivedOrders: React.FC<ArchivedOrdersProps> = ({ archivedOrders, searchTerm, onClearSearch }) => {
  const { unarchiveOrder, deleteOrder } = useOrdersActions();
  const { showError } = useErrorToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handleUnarchive = async (orderId: string) => {
    try {
      await unarchiveOrder(orderId);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to unarchive order');
    }
  };

  const handleDelete = async (order: Order) => {
    if (order.saleId) {
      showError('Cannot delete order: it has a linked sale. Delete the sale first.');
      return;
    }

    if (!window.confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) {
      return;
    }

    setDeletingId(order.id);
    try {
      await deleteOrder(order.id);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to delete order');
    } finally {
      setDeletingId(null);
    }
  };

  // Get display name for an item
  const getItemDisplayName = (item: OrderItem): string => {
    if (item.product) {
      const parts: string[] = [];
      if (item.product.team?.name) parts.push(item.product.team.name);
      if (item.product.name) parts.push(item.product.name);
      if (item.product.kitType?.name) parts.push(item.product.kitType.name);
      return parts.length > 0 ? parts.join(' - ') : 'Unnamed Product';
    }
    return 'Unknown Product';
  };

  // Get order summary
  const getOrderSummary = (order: Order): string => {
    if (!order.items || order.items.length === 0) return 'No items';
    const firstItem = order.items[0];
    const name = getItemDisplayName(firstItem);
    if (order.items.length > 1) {
      return `${name} (+${order.items.length - 1} more)`;
    }
    return name;
  };

  // Calculate total price
  const getTotalPrice = (order: Order): number => {
    return order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  };

  // Filter orders
  const filteredOrders = archivedOrders.filter((order) => {
    const summary = getOrderSummary(order).toLowerCase();
    return (
      summary.includes(searchTerm.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (filteredOrders.length === 0) {
    return (
      <div className="empty-state">
        {searchTerm ? (
          <>
            No archived orders found matching "{searchTerm}".{' '}
            <button onClick={onClearSearch} className="link-button">Clear search</button>
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
            <th>Items</th>
            <th>Total (RON)</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Archived</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => {
            const isFinished = order.status === OrderStatus.FINISHED;
            const hasSale = !!order.saleId;
            const isDeleting = deletingId === order.id;
            const isExpanded = expandedOrderId === order.id;

            return (
              <React.Fragment key={order.id}>
                <tr>
                  <td>
                    <div
                      style={{ cursor: order.items.length > 1 ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => order.items.length > 1 && setExpandedOrderId(isExpanded ? null : order.id)}
                    >
                      {order.items.length > 1 && (
                        <span style={{ fontSize: '0.75rem' }}>{isExpanded ? '▼' : '▶'}</span>
                      )}
                      <span>{getOrderSummary(order)}</span>
                    </div>
                  </td>
                  <td>{getTotalPrice(order).toFixed(2)}</td>
                  <td>
                    {order.customerName || '-'}
                    {order.phoneNumber && <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{order.phoneNumber}</div>}
                  </td>
                  <td>
                    <span className="status-badge" style={{ backgroundColor: '#6b7280', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.archivedAt ? new Date(order.archivedAt).toLocaleDateString() : '-'}</td>
                  <td>
                    <div className="action-buttons" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {!isFinished && (
                        <button
                          onClick={() => handleUnarchive(order.id)}
                          className="btn btn-secondary btn-sm"
                          title="Unarchive Order"
                        >
                          Unarchive
                        </button>
                      )}
                      {hasSale ? (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--warning-color, #f59e0b)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                          title="Cannot delete: has linked sale"
                        >
                          ⚠️ Has Sale
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDelete(order)}
                          className="btn btn-danger btn-sm"
                          title="Delete Order"
                          disabled={isDeleting}
                          style={{ opacity: isDeleting ? 0.5 : 1 }}
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {/* Expanded items */}
                {isExpanded && order.items.map((item, idx) => (
                  <tr key={`${order.id}-item-${idx}`} style={{ backgroundColor: 'var(--gray-50)' }}>
                    <td style={{ paddingLeft: 'var(--space-6)' }}>
                      <span style={{ fontSize: '0.875rem' }}>{getItemDisplayName(item)}</span>
                      <span style={{ marginLeft: '8px', color: 'var(--gray-500)' }}>
                        ({item.size} × {item.quantity})
                      </span>
                    </td>
                    <td>{(item.price * item.quantity).toFixed(2)}</td>
                    <td colSpan={4}></td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ArchivedOrders;
