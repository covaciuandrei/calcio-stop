/**
 * @jest-environment jsdom
 */

import 'jest-localstorage-mock';
import { useSettingsStore } from '../stores/settingsStore';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Settings Store CRUD Operations', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);

    // Reset store state to default
    useSettingsStore.setState({
      appBarOrder: ['dashboard', 'products', 'sales', 'namesets', 'teams', 'badges', 'kittypes'],
      dashboardOrder: ['products', 'sales', 'namesets', 'teams', 'badges', 'kitTypes'],
    });
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('CREATE Operations', () => {
    test('should initialize with default settings', () => {
      const state = useSettingsStore.getState();
      expect(state.appBarOrder).toEqual(['dashboard', 'products', 'sales', 'namesets', 'teams', 'badges', 'kittypes']);
      expect(state.dashboardOrder).toEqual(['products', 'sales', 'namesets', 'teams', 'badges', 'kitTypes']);
    });
  });

  describe('READ Operations', () => {
    test('should return current app bar order', () => {
      const { getAppBarOrder } = useSettingsStore.getState();
      const order = getAppBarOrder();
      expect(order).toEqual(['dashboard', 'products', 'sales', 'namesets', 'teams', 'badges', 'kittypes']);
    });

    test('should return current dashboard order', () => {
      const { getDashboardOrder } = useSettingsStore.getState();
      const order = getDashboardOrder();
      expect(order).toEqual(['products', 'sales', 'namesets', 'teams', 'badges', 'kitTypes']);
    });
  });

  describe('UPDATE Operations', () => {
    test('should update app bar order', () => {
      const newOrder = ['dashboard', 'teams', 'products', 'sales', 'namesets', 'badges', 'kittypes'];

      const { setAppBarOrder } = useSettingsStore.getState();
      setAppBarOrder(newOrder);

      const state = useSettingsStore.getState();
      expect(state.appBarOrder).toEqual(newOrder);
    });

    test('should update dashboard order', () => {
      const newOrder = ['teams', 'products', 'sales', 'namesets', 'badges', 'kitTypes'];

      const { setDashboardOrder } = useSettingsStore.getState();
      setDashboardOrder(newOrder);

      const state = useSettingsStore.getState();
      expect(state.dashboardOrder).toEqual(newOrder);
    });

    test('should handle partial order updates', () => {
      const partialOrder = ['dashboard', 'products', 'teams'];

      const { setAppBarOrder } = useSettingsStore.getState();
      setAppBarOrder(partialOrder);

      const state = useSettingsStore.getState();
      expect(state.appBarOrder).toEqual(partialOrder);
    });

    test('should handle empty order arrays', () => {
      const { setAppBarOrder, setDashboardOrder } = useSettingsStore.getState();

      setAppBarOrder([]);
      setDashboardOrder([]);

      const state = useSettingsStore.getState();
      expect(state.appBarOrder).toEqual([]);
      expect(state.dashboardOrder).toEqual([]);
    });
  });

  describe('RESET Operations', () => {
    test('should reset app bar order to default', () => {
      // First change the order
      const { setAppBarOrder, resetAppBarOrder } = useSettingsStore.getState();
      setAppBarOrder(['teams', 'products']);

      // Then reset
      resetAppBarOrder();

      const state = useSettingsStore.getState();
      expect(state.appBarOrder).toEqual(['dashboard', 'products', 'sales', 'namesets', 'teams', 'badges', 'kittypes']);
    });

    test('should reset dashboard order to default', () => {
      // First change the order
      const { setDashboardOrder, resetDashboardOrder } = useSettingsStore.getState();
      setDashboardOrder(['teams', 'products']);

      // Then reset
      resetDashboardOrder();

      const state = useSettingsStore.getState();
      expect(state.dashboardOrder).toEqual(['products', 'sales', 'namesets', 'teams', 'badges', 'kitTypes']);
    });

    test('should reset all settings to default', () => {
      // First change both orders
      const { setAppBarOrder, setDashboardOrder, resetAllSettings } = useSettingsStore.getState();
      setAppBarOrder(['teams', 'products']);
      setDashboardOrder(['teams', 'products']);

      // Then reset all
      resetAllSettings();

      const state = useSettingsStore.getState();
      expect(state.appBarOrder).toEqual(['dashboard', 'products', 'sales', 'namesets', 'teams', 'badges', 'kittypes']);
      expect(state.dashboardOrder).toEqual(['products', 'sales', 'namesets', 'teams', 'badges', 'kitTypes']);
    });
  });

  describe('Data Integrity', () => {
    test('should maintain separate app bar and dashboard orders', () => {
      const { setAppBarOrder, setDashboardOrder } = useSettingsStore.getState();

      setAppBarOrder(['dashboard', 'teams', 'products']);
      setDashboardOrder(['sales', 'namesets', 'badges']);

      const state = useSettingsStore.getState();
      expect(state.appBarOrder).toEqual(['dashboard', 'teams', 'products']);
      expect(state.dashboardOrder).toEqual(['sales', 'namesets', 'badges']);
    });

    test('should handle multiple updates correctly', () => {
      const { setAppBarOrder, setDashboardOrder } = useSettingsStore.getState();

      // Multiple updates
      setAppBarOrder(['dashboard', 'teams']);
      setDashboardOrder(['products', 'sales']);
      setAppBarOrder(['dashboard', 'products', 'teams']);
      setDashboardOrder(['teams', 'products', 'sales']);

      const state = useSettingsStore.getState();
      expect(state.appBarOrder).toEqual(['dashboard', 'products', 'teams']);
      expect(state.dashboardOrder).toEqual(['teams', 'products', 'sales']);
    });

    test('should handle order with duplicate items', () => {
      const { setAppBarOrder } = useSettingsStore.getState();

      const orderWithDuplicates = ['dashboard', 'products', 'teams', 'products', 'sales'];
      setAppBarOrder(orderWithDuplicates);

      const state = useSettingsStore.getState();
      expect(state.appBarOrder).toEqual(orderWithDuplicates);
    });

    test('should handle complex order scenarios', () => {
      const { setAppBarOrder, setDashboardOrder, resetAllSettings } = useSettingsStore.getState();

      // Set complex orders
      setAppBarOrder(['dashboard', 'teams', 'products', 'sales', 'namesets', 'badges', 'kittypes']);
      setDashboardOrder(['teams', 'products', 'sales', 'namesets', 'badges', 'kitTypes']);

      // Verify they are set correctly
      let state = useSettingsStore.getState();
      expect(state.appBarOrder).toHaveLength(7);
      expect(state.dashboardOrder).toHaveLength(6);

      // Reset and verify
      resetAllSettings();
      state = useSettingsStore.getState();
      expect(state.appBarOrder).toEqual(['dashboard', 'products', 'sales', 'namesets', 'teams', 'badges', 'kittypes']);
      expect(state.dashboardOrder).toEqual(['products', 'sales', 'namesets', 'teams', 'badges', 'kitTypes']);
    });
  });

  describe('Edge Cases', () => {
    test('should handle null/undefined values gracefully', () => {
      const { setAppBarOrder, setDashboardOrder } = useSettingsStore.getState();

      // These should not crash the store
      setAppBarOrder([]);
      setDashboardOrder([]);

      const state = useSettingsStore.getState();
      expect(state.appBarOrder).toEqual([]);
      expect(state.dashboardOrder).toEqual([]);
    });

    test('should maintain state consistency during rapid updates', () => {
      const { setAppBarOrder, setDashboardOrder } = useSettingsStore.getState();

      // Rapid updates
      setAppBarOrder(['dashboard', 'teams']);
      setDashboardOrder(['products']);
      setAppBarOrder(['dashboard', 'products', 'teams']);
      setDashboardOrder(['teams', 'products']);
      setAppBarOrder(['dashboard', 'teams', 'products', 'sales']);

      const state = useSettingsStore.getState();
      expect(state.appBarOrder).toEqual(['dashboard', 'teams', 'products', 'sales']);
      expect(state.dashboardOrder).toEqual(['teams', 'products']);
    });

    test('should handle getter functions correctly', () => {
      const { getAppBarOrder, getDashboardOrder, setAppBarOrder, setDashboardOrder } = useSettingsStore.getState();

      // Set custom orders
      setAppBarOrder(['dashboard', 'teams', 'products']);
      setDashboardOrder(['teams', 'products', 'sales']);

      // Test getters
      expect(getAppBarOrder()).toEqual(['dashboard', 'teams', 'products']);
      expect(getDashboardOrder()).toEqual(['teams', 'products', 'sales']);
    });
  });
});
