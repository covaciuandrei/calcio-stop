import React, { useEffect } from 'react';
import { useOrdersActions, useProductsActions } from '../../stores';
import AddNewOrderCard from './AddNewOrderCard';
import ArchivedOrdersCard from './ArchivedOrdersCard';
import OrdersTableListCard from './OrdersTableListCard';

const OrdersPage: React.FC = () => {
  const { loadOrders, loadArchivedOrders } = useOrdersActions();
  const { loadProducts } = useProductsActions();

  useEffect(() => {
    loadOrders();
    loadArchivedOrders();
    loadProducts(); // Needed for ProductPicker in AddOrderForm
  }, [loadOrders, loadArchivedOrders, loadProducts]);

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
