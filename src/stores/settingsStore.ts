import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as db from '../lib/db';

// Types
export interface AppBarButton {
  id: string;
  label: string;
  path: string;
}

export interface DashboardCard {
  id: string;
  title: string;
  description: string;
}

interface SettingsState {
  // AppBar order
  appBarOrder: string[];
  setAppBarOrder: (order: string[]) => Promise<void>;
  getAppBarOrder: () => Promise<string[]>;

  // Dashboard order
  dashboardOrder: string[];
  setDashboardOrder: (order: string[]) => Promise<void>;
  getDashboardOrder: () => Promise<string[]>;

  // Reset functions
  resetAppBarOrder: () => Promise<void>;
  resetDashboardOrder: () => Promise<void>;
  resetAllSettings: () => Promise<void>;

  // Loading and error states
  isLoading: boolean;
  error: string | null;
}

// Default orders
const DEFAULT_APPBAR_ORDER = ['dashboard', 'products', 'sales', 'namesets', 'teams', 'badges', 'kittypes'];

const DEFAULT_DASHBOARD_ORDER = ['products', 'sales', 'namesets', 'teams', 'badges', 'kitTypes'];

// Store
export const useSettingsStore = create<SettingsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      appBarOrder: DEFAULT_APPBAR_ORDER,
      dashboardOrder: DEFAULT_DASHBOARD_ORDER,
      isLoading: false,
      error: null,

      // AppBar actions
      setAppBarOrder: async (order: string[]) => {
        set({ isLoading: true, error: null });
        try {
          await db.setAppBarOrder(order);
          set({ appBarOrder: order, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to set app bar order',
            isLoading: false,
          });
        }
      },

      getAppBarOrder: async () => {
        set({ isLoading: true, error: null });
        try {
          const order = await db.getAppBarOrder();
          set({ appBarOrder: order, isLoading: false });
          return order;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to get app bar order',
            isLoading: false,
          });
          return DEFAULT_APPBAR_ORDER;
        }
      },

      // Dashboard actions
      setDashboardOrder: async (order: string[]) => {
        set({ isLoading: true, error: null });
        try {
          await db.setDashboardOrder(order);
          set({ dashboardOrder: order, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to set dashboard order',
            isLoading: false,
          });
        }
      },

      getDashboardOrder: async () => {
        set({ isLoading: true, error: null });
        try {
          const order = await db.getDashboardOrder();
          set({ dashboardOrder: order, isLoading: false });
          return order;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to get dashboard order',
            isLoading: false,
          });
          return DEFAULT_DASHBOARD_ORDER;
        }
      },

      // Reset actions
      resetAppBarOrder: async () => {
        set({ isLoading: true, error: null });
        try {
          await db.setAppBarOrder(DEFAULT_APPBAR_ORDER);
          set({ appBarOrder: DEFAULT_APPBAR_ORDER, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to reset app bar order',
            isLoading: false,
          });
        }
      },

      resetDashboardOrder: async () => {
        set({ isLoading: true, error: null });
        try {
          await db.setDashboardOrder(DEFAULT_DASHBOARD_ORDER);
          set({ dashboardOrder: DEFAULT_DASHBOARD_ORDER, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to reset dashboard order',
            isLoading: false,
          });
        }
      },

      resetAllSettings: async () => {
        set({ isLoading: true, error: null });
        try {
          await db.setAppBarOrder(DEFAULT_APPBAR_ORDER);
          await db.setDashboardOrder(DEFAULT_DASHBOARD_ORDER);
          set({
            appBarOrder: DEFAULT_APPBAR_ORDER,
            dashboardOrder: DEFAULT_DASHBOARD_ORDER,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to reset all settings',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'settings-store',
    }
  )
);

// Convenience hooks
export const useSettings = () => useSettingsStore();
export const useAppBarOrder = () => useSettingsStore((state) => state.appBarOrder);
export const useDashboardOrder = () => useSettingsStore((state) => state.dashboardOrder);
export const useSettingsActions = () => ({
  setAppBarOrder: useSettingsStore.getState().setAppBarOrder,
  setDashboardOrder: useSettingsStore.getState().setDashboardOrder,
  resetAppBarOrder: useSettingsStore.getState().resetAppBarOrder,
  resetDashboardOrder: useSettingsStore.getState().resetDashboardOrder,
  resetAllSettings: useSettingsStore.getState().resetAllSettings,
});

// Selectors
export const settingsSelectors = {
  getAppBarOrder: (state: SettingsState) => state.appBarOrder,
  getDashboardOrder: (state: SettingsState) => state.dashboardOrder,
  isDefaultAppBarOrder: (state: SettingsState) =>
    JSON.stringify(state.appBarOrder) === JSON.stringify(DEFAULT_APPBAR_ORDER),
  isDefaultDashboardOrder: (state: SettingsState) =>
    JSON.stringify(state.dashboardOrder) === JSON.stringify(DEFAULT_DASHBOARD_ORDER),
};
