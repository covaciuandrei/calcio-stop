import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as db from '../lib/db';
import { Return } from '../types';

interface ReturnsFilters {
  startDate?: string;
  endDate?: string;
  saleType?: 'OLX' | 'IN-PERSON' | 'VINTED';
}

interface ReturnsState {
  // State
  returns: Return[];
  isLoading: boolean;
  error: string | null;
  filters: ReturnsFilters;

  // Actions
  addReturn: (returnRecord: Omit<Return, 'id' | 'createdAt'>) => Promise<void>;
  deleteReturn: (id: string) => Promise<void>;
  setReturns: (returns: Return[]) => void;
  setFilters: (filters: ReturnsFilters) => void;
  loadReturns: (filters?: ReturnsFilters) => Promise<void>;
}

// Selectors
export const returnsSelectors = {
  getReturnById: (state: ReturnsState, id: string) => state.returns.find((r) => r.id === id),
  getReturnsByProduct: (state: ReturnsState, productId: string) =>
    state.returns.filter((r) => r.items.some((item) => item.productId === productId)),
  getReturnsByCustomer: (state: ReturnsState, customerName: string) =>
    state.returns.filter((r) => r.customerName.toLowerCase().includes(customerName.toLowerCase())),
  getTotalReturns: (state: ReturnsState) => state.returns.length,
  getReturnsByDateRange: (state: ReturnsState, startDate: string, endDate: string) =>
    state.returns.filter((r) => r.date >= startDate && r.date <= endDate),
};

// Store
export const useReturnsStore = create<ReturnsState>()(
  devtools(
    (set, get) => {
      // Calculate default filters (current month)
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const defaultFilters: ReturnsFilters = {
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0],
      };

      return {
        // Initial state
        returns: [],
        isLoading: false,
        error: null,
        filters: defaultFilters,

        // Actions
        addReturn: async (returnData: Omit<Return, 'id' | 'createdAt'>) => {
          set({ isLoading: true, error: null });
          try {
            const newReturn = await db.createReturn({
              ...returnData,
              createdAt: new Date().toISOString(),
            });
            set((state) => ({
              returns: [...state.returns, newReturn],
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to add return',
              isLoading: false,
            });
          }
        },

        deleteReturn: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            await db.deleteReturn(id);
            set((state) => ({
              returns: state.returns.filter((r) => r.id !== id),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to delete return',
              isLoading: false,
            });
          }
        },

        setReturns: (returns: Return[]) => {
          set({ returns });
        },

        setFilters: (filters: ReturnsFilters) => {
          set({ filters });
        },

        loadReturns: async (filters?: ReturnsFilters) => {
          set({ isLoading: true, error: null });
          try {
            const filtersToUse = filters || get().filters;
            const returns = await db.getReturns(filtersToUse);
            set({ returns, filters: filtersToUse, isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to load returns',
              isLoading: false,
            });
          }
        },
      };
    },
    {
      name: 'returns-store',
    }
  )
);

// Typed selectors for easier usage
export const useReturns = () => useReturnsStore();
export const useReturnsList = () => useReturnsStore((state) => state.returns);
// For backward compatibility - use getState() to avoid re-renders
export const useReturnsActions = () => ({
  addReturn: useReturnsStore.getState().addReturn,
  deleteReturn: useReturnsStore.getState().deleteReturn,
  setReturns: useReturnsStore.getState().setReturns,
  setFilters: useReturnsStore.getState().setFilters,
  loadReturns: useReturnsStore.getState().loadReturns,
});

export const useReturnsFilters = () => useReturnsStore((state) => state.filters);
