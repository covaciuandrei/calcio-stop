import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as db from '../lib/db';
import { Sale } from '../types';

interface SalesFilters {
  startDate?: string;
  endDate?: string;
  saleType?: 'OLX' | 'IN-PERSON';
}

interface SalesState {
  // State
  sales: Sale[];
  isLoading: boolean;
  error: string | null;
  filters: SalesFilters;

  // Actions
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => Promise<void>;
  updateSale: (id: string, updates: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  setSales: (sales: Sale[]) => void;
  setFilters: (filters: SalesFilters) => void;
  loadSales: (filters?: SalesFilters) => Promise<void>;
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
    (set, get) => {
      // Calculate default filters (current month)
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const defaultFilters: SalesFilters = {
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0],
      };

      return {
        // Initial state
        sales: [],
        isLoading: false,
        error: null,
        filters: defaultFilters,

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

      setFilters: (filters: SalesFilters) => {
        set({ filters });
      },

      loadSales: async (filters?: SalesFilters) => {
        set({ isLoading: true, error: null });
        try {
          const filtersToUse = filters || get().filters;
          const sales = await db.getSales(filtersToUse);
          set({ sales, filters: filtersToUse, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load sales',
            isLoading: false,
          });
        }
      },
      };
    },
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
  setFilters: useSalesStore.getState().setFilters,
  loadSales: useSalesStore.getState().loadSales,
});

export const useSalesFilters = () => useSalesStore((state) => state.filters);
