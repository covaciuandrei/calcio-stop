import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useErrorToast } from '../../hooks/useErrorToast';
import { useOrdersActions } from '../../stores';
import { Order, OrderStatus, ORDER_STATUS_TRANSITIONS, OrderItem } from '../../types';
import AddOrderForm from './AddOrderForm';

interface OrdersTableListProps {
  orders: Order[];
  searchTerm: string;
  onClearSearch: () => void;
}

const OrdersTableList: React.FC<OrdersTableListProps> = ({ orders, searchTerm, onClearSearch }) => {
  const { updateOrder, archiveOrder } = useOrdersActions();
  const { showError } = useErrorToast();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<{ orderId: string; name: string; phone: string } | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [finishErrors, setFinishErrors] = useState<{ name?: string; phone?: string }>({});

  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    const currentStatus = order.status;

    // Check if allowed
    const allowedTransitions = ORDER_STATUS_TRANSITIONS[currentStatus] || [];
    if (newStatus !== currentStatus && !allowedTransitions.includes(newStatus)) {
      showError(`Cannot transition from '${currentStatus}' to '${newStatus}'`);
      return;
    }

    // If going to FINISHED, need customer info
    if (newStatus === OrderStatus.FINISHED) {
      if (!order.customerName?.trim() || !order.phoneNumber?.trim()) {
        // Need to collect customer info first
        setEditingCustomer({ orderId: order.id, name: order.customerName || '', phone: order.phoneNumber || '' });
        return;
      }
    }

    try {
      await updateOrder(order.id, { status: newStatus });
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  const handleFinishWithCustomer = async () => {
    if (!editingCustomer) return;

    const errors: { name?: string; phone?: string } = {};
    if (!editingCustomer.name.trim()) errors.name = 'Customer name is required';
    if (!editingCustomer.phone.trim()) errors.phone = 'Phone number is required';

    if (Object.keys(errors).length > 0) {
      setFinishErrors(errors);
      return;
    }
    setFinishErrors({});

    try {
      await updateOrder(editingCustomer.orderId, {
        status: OrderStatus.FINISHED,
        customerName: editingCustomer.name,
        phoneNumber: editingCustomer.phone,
      });
      setEditingCustomer(null);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to finish order');
    }
  };

  const handleArchive = async (orderId: string) => {
    try {
      await archiveOrder(orderId);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to archive order');
    }
  };

  const getAvailableStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    const allowed = ORDER_STATUS_TRANSITIONS[currentStatus] || [];
    return [currentStatus, ...allowed];
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

  // Get order summary (first item + count)
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
  const filteredOrders = orders.filter((order) => {
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
            No orders found matching "{searchTerm}".{' '}
            <button onClick={onClearSearch} className="link-button">Clear search</button>
          </>
        ) : (
          'No active orders. Create one to get started.'
        )}
      </div>
    );
  }

  return (
    <>
      {/* Edit Order Modal */}
      {
        editingOrder && createPortal(
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99990 }}>
            <div className="modal-content" style={{ background: 'white', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Edit Order / {editingOrder.customerName || 'No Name'}</h3>
                <button onClick={() => setEditingOrder(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--gray-500)' }}>×</button>
              </div>
              <AddOrderForm
                onClose={() => setEditingOrder(null)}
                initialOrder={editingOrder}
              />
            </div>
          </div>,
          document.body
        )
      }

      {/* Customer Info Modal */}
      {
        editingCustomer && createPortal(
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
            <div className="modal-content" style={{ background: 'white', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', minWidth: '300px' }}>
              <h3>Complete Order</h3>
              <p style={{ marginBottom: 'var(--space-3)' }}>Enter customer details to finish this order:</p>
              <div className={`form-group ${finishErrors.name ? 'has-error' : ''}`} style={{ marginBottom: 'var(--space-3)' }}>
                <label>Customer Name *</label>
                <input
                  type="text"
                  value={editingCustomer.name}
                  onChange={(e) => {
                    setEditingCustomer({ ...editingCustomer, name: e.target.value });
                    if (finishErrors.name) setFinishErrors({ ...finishErrors, name: undefined });
                  }}
                  className="form-input"
                  placeholder="Customer name"
                />
                {finishErrors.name && <div className="error-message">{finishErrors.name}</div>}
              </div>
              <div className={`form-group ${finishErrors.phone ? 'has-error' : ''}`} style={{ marginBottom: 'var(--space-3)' }}>
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={editingCustomer.phone}
                  onChange={(e) => {
                    setEditingCustomer({ ...editingCustomer, phone: e.target.value });
                    if (finishErrors.phone) setFinishErrors({ ...finishErrors, phone: undefined });
                  }}
                  className="form-input"
                  placeholder="+40..."
                />
                {finishErrors.phone && <div className="error-message">{finishErrors.phone}</div>}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                <button onClick={() => { setEditingCustomer(null); setFinishErrors({}); }} className="btn btn-secondary">Cancel</button>
                <button onClick={handleFinishWithCustomer} className="btn btn-primary">Finish Order</button>
              </div>
            </div>
          </div>,
          document.body
        )
      }

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Items</th>
              <th>Total (RON)</th>
              <th>Customer</th>
              <th>Sale Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const isFinished = order.status === OrderStatus.FINISHED;
              const availableStatuses = getAvailableStatuses(order.status);
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
                    <td>{order.saleType}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                        disabled={isFinished}
                        className="form-select"
                        style={{ minWidth: '120px', opacity: isFinished ? 0.6 : 1 }}
                      >
                        {availableStatuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      {isFinished && order.saleId && (
                        <div style={{ fontSize: '0.65rem', color: 'var(--success-color)', marginTop: '2px' }}>✓ Sale created</div>
                      )}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      {!isFinished && (
                        <button onClick={() => setEditingOrder(order)} className="btn btn-secondary btn-sm" style={{ marginRight: '4px' }}>
                          Edit
                        </button>
                      )}
                      <button onClick={() => handleArchive(order.id)} className="btn btn-secondary btn-sm">
                        Archive
                      </button>
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
                      <td colSpan={5}></td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrdersTableList;
