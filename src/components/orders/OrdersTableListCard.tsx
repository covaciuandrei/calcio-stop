import React, { useState } from 'react';
import { useOrdersActions, useOrdersList } from '../../stores';
import { Order } from '../../types';
import styles from '../shared/TableListCard.module.css';
import OrdersTableList from './OrdersTableList';

interface OrdersTableListCardProps {
  orders?: Order[];
  isReadOnly?: boolean;
  showActions?: boolean;
  limit?: number;
}

const OrdersTableListCard: React.FC<OrdersTableListCardProps> = ({
  orders: propOrders,
  isReadOnly = false,
  showActions = true,
  limit,
}) => {
  // Get data and actions from stores
  const storeOrders = useOrdersList();
  const { archiveOrder } = useOrdersActions();

  const [isOrdersExpanded, setIsOrdersExpanded] = useState(true);
  const [ordersSearchTerm, setOrdersSearchTerm] = useState('');

  // Use prop orders if provided, otherwise use store orders
  const orders = propOrders || storeOrders;

  // Apply limit if specified
  const displayOrders = limit ? orders.slice(0, limit) : orders;

  const deleteOrder = (id: string) => {
    if (!isReadOnly) {
      archiveOrder(id);
      setOrdersSearchTerm(''); // Clear search after action
    }
  };

  return (
    <div className="card">
      <div
        className={`card-header mini-header mini-header-orange ${!isReadOnly ? styles.expandableHeader : ''}`}
        onClick={!isReadOnly ? () => setIsOrdersExpanded(!isOrdersExpanded) : undefined}
      >
        <span>
          Active Orders ({displayOrders.length}
          {limit && orders.length > limit ? ` (showing ${limit})` : ''}
          {displayOrders.length !== orders.length ? ` of ${orders.length}` : ''})
        </span>
        {!isReadOnly && (
          <span className={`${styles.expandIcon} ${isOrdersExpanded ? styles.expanded : styles.collapsed}`}>▼</span>
        )}
      </div>

      {!isReadOnly && !isOrdersExpanded && (
        <div className={styles.collapsedContent}>
          There are {displayOrders.length} orders available
          {displayOrders.length !== orders.length ? ` (${orders.length} total)` : ''}.
        </div>
      )}

      {(isReadOnly || isOrdersExpanded) && (
        <>
          <h3 className="card-section-header">Orders List</h3>
          {displayOrders.length >= 2 && (
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search orders..."
                value={ordersSearchTerm}
                onChange={(e) => setOrdersSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          )}
          <div className={styles.tableContainer}>
            {displayOrders.length > 0 ? (
              <OrdersTableList
                orders={displayOrders}
                onDelete={deleteOrder}
                searchTerm={ordersSearchTerm}
                isReadOnly={isReadOnly}
              />
            ) : (
              <div className={styles.emptyState}>No orders found matching your search criteria.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersTableListCard;
