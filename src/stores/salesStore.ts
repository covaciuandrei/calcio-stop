import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as db from '../lib/db';
import { Sale } from '../types';

interface SalesState {
  // State
  sales: Sale[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => Promise<void>;
  updateSale: (id: string, updates: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  setSales: (sales: Sale[]) => void;
  loadSales: () => Promise<void>;
}

// Selectors
export const salesSelectors = {
  getSaleById: (state: SalesState, id: string) => state.sales.find((s) => s.id === id),
  getSalesByProduct: (state: SalesState, productId: string) =>
    state.sales.filter((s) => s.items.some((item) => item.productId === productId)),
  getSalesByCustomer: (state: SalesState, customerName: string) =>
    state.sales.filter((s) => s.customerName.toLowerCase().includes(customerName.toLowerCase())),
  getTotalRevenue: (state: SalesState) =>
    state.sales.reduce(
      (total, sale) => total + sale.items.reduce((itemTotal, item) => itemTotal + item.priceSold * item.quantity, 0),
      0
    ),
  getTotalSales: (state: SalesState) => state.sales.length,
  getSalesByDateRange: (state: SalesState, startDate: string, endDate: string) =>
    state.sales.filter((s) => s.date >= startDate && s.date <= endDate),
};

// Store
export const useSalesStore = create<SalesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      sales: [],
      isLoading: false,
      error: null,

      // Actions
      addSale: async (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
        set({ isLoading: true, error: null });
        try {
          const newSale = await db.createSale({
            ...saleData,
            createdAt: new Date().toISOString(),
          });
          set((state) => ({
            sales: [...state.sales, newSale],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add sale',
            isLoading: false,
          });
        }
      },

      updateSale: async (id: string, updates: Partial<Sale>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedSale = await db.updateSale(id, updates);
          set((state) => ({
            sales: state.sales.map((s) => (s.id === id ? updatedSale : s)),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update sale',
            isLoading: false,
          });
        }
      },

      deleteSale: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await db.deleteSale(id);
          set((state) => ({
            sales: state.sales.filter((s) => s.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete sale',
            isLoading: false,
          });
        }
      },

      setSales: (sales: Sale[]) => {
        set({ sales });
      },

      loadSales: async () => {
        set({ isLoading: true, error: null });
        try {
          const sales = await db.getSales();
          set({ sales, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load sales',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'sales-store',
    }
  )
);

// Typed selectors for easier usage
export const useSales = () => useSalesStore();
export const useSalesList = () => useSalesStore((state) => state.sales);
// For backward compatibility - use getState() to avoid re-renders
export const useSalesActions = () => ({
  addSale: useSalesStore.getState().addSale,
  updateSale: useSalesStore.getState().updateSale,
  deleteSale: useSalesStore.getState().deleteSale,
  setSales: useSalesStore.getState().setSales,
  loadSales: useSalesStore.getState().loadSales,
});
