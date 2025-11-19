import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as db from '../lib/db';
import { Reservation } from '../types';

interface ReservationsState {
  // State
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status' | 'completedAt'>) => Promise<void>;
  updateReservation: (id: string, updates: Partial<Reservation>) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  completeReservation: (
    id: string,
    saleData: { customerName?: string; date?: string; saleType?: 'OLX' | 'IN-PERSON' }
  ) => Promise<void>;
  setReservations: (reservations: Reservation[]) => void;
  loadReservations: () => Promise<void>;
}

// Selectors
export const reservationsSelectors = {
  getReservationById: (state: ReservationsState, id: string) => state.reservations.find((r) => r.id === id),
  getPendingReservations: (state: ReservationsState) => state.reservations.filter((r) => r.status === 'pending'),
  getCompletedReservations: (state: ReservationsState) => state.reservations.filter((r) => r.status === 'completed'),
  getExpiredReservations: (state: ReservationsState) => {
    const now = new Date();
    return state.reservations.filter((r) => r.status === 'pending' && new Date(r.expiringDate) < now);
  },
};

// Store
export const useReservationsStore = create<ReservationsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      reservations: [],
      isLoading: false,
      error: null,

      // Actions
      addReservation: async (reservationData) => {
        set({ isLoading: true, error: null });
        try {
          const newReservation = await db.createReservation({
            ...reservationData,
            createdAt: new Date().toISOString(),
          });
          // Reload products to reflect stock changes
          const { useProductsStore } = await import('./productsStore');
          await useProductsStore.getState().loadProducts();
          set((state) => ({
            reservations: [...state.reservations, newReservation],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add reservation',
            isLoading: false,
          });
        }
      },

      updateReservation: async (id: string, updates: Partial<Reservation>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedReservation = await db.updateReservation(id, updates);
          set((state) => ({
            reservations: state.reservations.map((r) => (r.id === id ? updatedReservation : r)),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update reservation',
            isLoading: false,
          });
        }
      },

      deleteReservation: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await db.deleteReservation(id);
          // Reload products to reflect restored stock
          const { useProductsStore } = await import('./productsStore');
          await useProductsStore.getState().loadProducts();
          set((state) => ({
            reservations: state.reservations.filter((r) => r.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete reservation',
            isLoading: false,
          });
        }
      },

      completeReservation: async (id: string, saleData) => {
        set({ isLoading: true, error: null });
        try {
          const completedReservation = await db.completeReservation(id, saleData);
          // Reload sales to show the new sale
          const { useSalesStore } = await import('./salesStore');
          await useSalesStore.getState().loadSales();
          set((state) => ({
            reservations: state.reservations.map((r) => (r.id === id ? completedReservation : r)),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to complete reservation',
            isLoading: false,
          });
        }
      },

      setReservations: (reservations: Reservation[]) => {
        set({ reservations });
      },

      loadReservations: async () => {
        set({ isLoading: true, error: null });
        try {
          const reservations = await db.getReservations();
          set({ reservations, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load reservations',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'reservations-store',
    }
  )
);

// Typed selectors for easier usage
export const useReservations = () => useReservationsStore();
export const useReservationsList = () => useReservationsStore((state) => state.reservations);

// For backward compatibility - use getState() to avoid re-renders
export const useReservationsActions = () => ({
  addReservation: useReservationsStore.getState().addReservation,
  updateReservation: useReservationsStore.getState().updateReservation,
  deleteReservation: useReservationsStore.getState().deleteReservation,
  completeReservation: useReservationsStore.getState().completeReservation,
  setReservations: useReservationsStore.getState().setReservations,
  loadReservations: useReservationsStore.getState().loadReservations,
});
