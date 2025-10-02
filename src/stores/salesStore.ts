import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Sale } from '../types';

interface SalesState {
  // State
  sales: Sale[];

  // Actions
  addSale: (sale: Sale) => void;
  updateSale: (id: string, updates: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  setSales: (sales: Sale[]) => void;
}

// Selectors
export const salesSelectors = {
  getSaleById: (state: SalesState, id: string) => state.sales.find((s) => s.id === id),
  getSalesByProduct: (state: SalesState, productId: string) => state.sales.filter((s) => s.productId === productId),
  getSalesByCustomer: (state: SalesState, customerName: string) =>
    state.sales.filter((s) => s.customerName.toLowerCase().includes(customerName.toLowerCase())),
  getTotalRevenue: (state: SalesState) =>
    state.sales.reduce((total, sale) => total + sale.priceSold * sale.quantity, 0),
  getTotalSales: (state: SalesState) => state.sales.length,
  getSalesByDateRange: (state: SalesState, startDate: string, endDate: string) =>
    state.sales.filter((s) => s.date >= startDate && s.date <= endDate),
};

// Store
export const useSalesStore = create<SalesState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        sales: [],

        // Actions
        addSale: (sale: Sale) => {
          set((state) => ({
            sales: [...state.sales, sale],
          }));
        },

        updateSale: (id: string, updates: Partial<Sale>) => {
          set((state) => ({
            sales: state.sales.map((s) => (s.id === id ? { ...s, ...updates } : s)),
          }));
        },

        deleteSale: (id: string) => {
          set((state) => ({
            sales: state.sales.filter((s) => s.id !== id),
          }));
        },

        setSales: (sales: Sale[]) => {
          set({ sales });
        },
      }),
      {
        name: 'sales-store',
        partialize: (state) => ({
          sales: state.sales,
        }),
      }
    ),
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
});
