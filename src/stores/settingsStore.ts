import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

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
  setAppBarOrder: (order: string[]) => void;
  getAppBarOrder: () => string[];

  // Dashboard order
  dashboardOrder: string[];
  setDashboardOrder: (order: string[]) => void;
  getDashboardOrder: () => string[];

  // Reset functions
  resetAppBarOrder: () => void;
  resetDashboardOrder: () => void;
  resetAllSettings: () => void;
}

// Default orders
const DEFAULT_APPBAR_ORDER = ['dashboard', 'products', 'sales', 'namesets', 'teams', 'badges', 'kittypes'];

const DEFAULT_DASHBOARD_ORDER = ['products', 'sales', 'namesets', 'teams', 'badges', 'kitTypes'];

// Store
export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        appBarOrder: DEFAULT_APPBAR_ORDER,
        dashboardOrder: DEFAULT_DASHBOARD_ORDER,

        // AppBar actions
        setAppBarOrder: (order: string[]) => {
          set({ appBarOrder: order });
        },

        getAppBarOrder: () => {
          return get().appBarOrder;
        },

        // Dashboard actions
        setDashboardOrder: (order: string[]) => {
          set({ dashboardOrder: order });
        },

        getDashboardOrder: () => {
          return get().dashboardOrder;
        },

        // Reset actions
        resetAppBarOrder: () => {
          set({ appBarOrder: DEFAULT_APPBAR_ORDER });
        },

        resetDashboardOrder: () => {
          set({ dashboardOrder: DEFAULT_DASHBOARD_ORDER });
        },

        resetAllSettings: () => {
          set({
            appBarOrder: DEFAULT_APPBAR_ORDER,
            dashboardOrder: DEFAULT_DASHBOARD_ORDER,
          });
        },
      }),
      {
        name: 'calcio-stop-settings',
        // Only persist the order arrays
        partialize: (state) => ({
          appBarOrder: state.appBarOrder,
          dashboardOrder: state.dashboardOrder,
        }),
      }
    ),
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
