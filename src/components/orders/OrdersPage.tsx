import React, { useEffect } from 'react';
import { useOrdersActions } from '../../stores';
import AddNewOrderCard from './AddNewOrderCard';
import ArchivedOrdersCard from './ArchivedOrdersCard';
import OrdersTableListCard from './OrdersTableListCard';

const OrdersPage: React.FC = () => {
  const { loadOrders, loadArchivedOrders } = useOrdersActions();

  useEffect(() => {
    loadOrders();
    loadArchivedOrders();
  }, [loadOrders, loadArchivedOrders]);

  return (
    <div style={{ paddingBottom: 'var(--space-8)' }}>
      {/* Add New Order Card */}
      <AddNewOrderCard />

      {/* Orders Table List Card */}
      <OrdersTableListCard />

      {/* Archived Orders Card */}
      <ArchivedOrdersCard />
    </div>
  );
};

export default OrdersPage;
