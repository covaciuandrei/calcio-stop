import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as db from '../lib/db';
import { Order, OrderStatus } from '../types';

interface OrdersState {
  // Data
  orders: Order[];
  archivedOrders: Order[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadOrders: () => Promise<void>;
  loadArchivedOrders: () => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  archiveOrder: (id: string) => Promise<void>;
  unarchiveOrder: (id: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}

// Store
export const useOrdersStore = create<OrdersState>()(
  devtools(
    (set, get) => ({
      // Initial state
      orders: [],
      archivedOrders: [],
      isLoading: false,
      error: null,

      // Load orders
      loadOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const orders = await db.getOrders();
          set({ orders, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load orders',
            isLoading: false,
          });
        }
      },

      // Load archived orders
      loadArchivedOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const archivedOrders = await db.getArchivedOrders();
          set({ archivedOrders, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load archived orders',
            isLoading: false,
          });
        }
      },

      // Add order
      addOrder: async (orderData) => {
        set({ isLoading: true, error: null });
        try {
          const newOrder = await db.addOrder(orderData);
          set((state) => ({
            orders: [...state.orders, newOrder],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add order',
            isLoading: false,
          });
        }
      },

      // Update order
      updateOrder: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const updatedOrder = await db.updateOrder(id, updates);
          set((state) => ({
            orders: state.orders.map((order) => (order.id === id ? updatedOrder : order)),
            archivedOrders: state.archivedOrders.map((order) => (order.id === id ? updatedOrder : order)),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update order',
            isLoading: false,
          });
        }
      },

      // Archive order
      archiveOrder: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await db.archiveOrder(id);
          set((state) => {
            const orderToArchive = state.orders.find((order) => order.id === id);
            return {
              orders: state.orders.filter((order) => order.id !== id),
              archivedOrders: orderToArchive ? [...state.archivedOrders, orderToArchive] : state.archivedOrders,
              isLoading: false,
            };
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to archive order',
            isLoading: false,
          });
        }
      },

      // Unarchive order
      unarchiveOrder: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await db.unarchiveOrder(id);
          set((state) => {
            const orderToUnarchive = state.archivedOrders.find((order) => order.id === id);
            return {
              orders: orderToUnarchive ? [...state.orders, orderToUnarchive] : state.orders,
              archivedOrders: state.archivedOrders.filter((order) => order.id !== id),
              isLoading: false,
            };
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to unarchive order',
            isLoading: false,
          });
        }
      },

      // Delete order
      deleteOrder: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await db.deleteOrder(id);
          set((state) => ({
            orders: state.orders.filter((order) => order.id !== id),
            archivedOrders: state.archivedOrders.filter((order) => order.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete order',
            isLoading: false,
          });
        }
      },

      // Update order status
      updateOrderStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
          const updatedOrder = await db.updateOrder(id, { status });
          set((state) => ({
            orders: state.orders.map((order) => (order.id === id ? updatedOrder : order)),
            archivedOrders: state.archivedOrders.map((order) => (order.id === id ? updatedOrder : order)),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update order status',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'orders-store',
    }
  )
);

// Selectors
export const useOrdersList = () => useOrdersStore((state) => state.orders);
export const useArchivedOrders = () => useOrdersStore((state) => state.archivedOrders);
export const useOrdersLoading = () => useOrdersStore((state) => state.isLoading);
export const useOrdersError = () => useOrdersStore((state) => state.error);

// Actions
export const useOrdersActions = () => {
  const store = useOrdersStore();
  return {
    loadOrders: store.loadOrders,
    loadArchivedOrders: store.loadArchivedOrders,
    addOrder: store.addOrder,
    updateOrder: store.updateOrder,
    archiveOrder: store.archiveOrder,
    unarchiveOrder: store.unarchiveOrder,
    deleteOrder: store.deleteOrder,
    updateOrderStatus: store.updateOrderStatus,
  };
};
