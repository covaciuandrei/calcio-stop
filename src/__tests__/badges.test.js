/**
 * @jest-environment jsdom
 */

import 'jest-localstorage-mock';
import { useBadgesStore } from '../stores/badgesStore';
import { Badge } from '../types';

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

describe('Badges Store CRUD Operations', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Reset store state
    useBadgesStore.setState({
      badges: [],
      archivedBadges: [],
    });
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('CREATE Operations', () => {
    test('should add a new badge to the store', () => {
      const newBadge: Badge = {
        id: 'badge-1',
        name: 'Champions League',
        season: '2024/2025',
        quantity: 50,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addBadge } = useBadgesStore.getState();
      addBadge(newBadge);

      const state = useBadgesStore.getState();
      expect(state.badges).toHaveLength(1);
      expect(state.badges[0]).toEqual(newBadge);
    });

    test('should add multiple badges without duplicates', () => {
      const badge1: Badge = {
        id: 'badge-1',
        name: 'Champions League',
        season: '2024/2025',
        quantity: 50,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const badge2: Badge = {
        id: 'badge-2',
        name: 'La Liga',
        season: '2024/2025',
        quantity: 30,
        createdAt: '2024-01-02T00:00:00.000Z',
      };

      const { addBadge } = useBadgesStore.getState();
      addBadge(badge1);
      addBadge(badge2);

      const state = useBadgesStore.getState();
      expect(state.badges).toHaveLength(2);
      expect(state.badges).toContainEqual(badge1);
      expect(state.badges).toContainEqual(badge2);
    });
  });

  describe('READ Operations', () => {
    test('should return all badges', () => {
      const badges: Badge[] = [
        {
          id: 'badge-1',
          name: 'Champions League',
          season: '2024/2025',
          quantity: 50,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'badge-2',
          name: 'La Liga',
          season: '2024/2025',
          quantity: 30,
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      useBadgesStore.setState({ badges });

      const state = useBadgesStore.getState();
      expect(state.badges).toEqual(badges);
    });

    test('should return archived badges', () => {
      const archivedBadges: Badge[] = [
        {
          id: 'badge-1',
          name: 'Champions League',
          season: '2023/2024',
          quantity: 0,
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      useBadgesStore.setState({ archivedBadges });

      const state = useBadgesStore.getState();
      expect(state.archivedBadges).toEqual(archivedBadges);
    });
  });

  describe('UPDATE Operations', () => {
    test('should update an existing badge', () => {
      const originalBadge: Badge = {
        id: 'badge-1',
        name: 'Champions League',
        season: '2024/2025',
        quantity: 50,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useBadgesStore.setState({ badges: [originalBadge] });

      const { updateBadge } = useBadgesStore.getState();
      updateBadge('badge-1', { 
        name: 'UEFA Champions League',
        quantity: 75
      });

      const state = useBadgesStore.getState();
      expect(state.badges[0].name).toBe('UEFA Champions League');
      expect(state.badges[0].quantity).toBe(75);
      expect(state.badges[0].id).toBe('badge-1');
      expect(state.badges[0].createdAt).toBe(originalBadge.createdAt);
    });

    test('should update badge season and quantity', () => {
      const originalBadge: Badge = {
        id: 'badge-1',
        name: 'Champions League',
        season: '2024/2025',
        quantity: 50,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useBadgesStore.setState({ badges: [originalBadge] });

      const { updateBadge } = useBadgesStore.getState();
      updateBadge('badge-1', { 
        season: '2025/2026',
        quantity: 100
      });

      const state = useBadgesStore.getState();
      expect(state.badges[0].season).toBe('2025/2026');
      expect(state.badges[0].quantity).toBe(100);
    });

    test('should not update non-existent badge', () => {
      const originalBadge: Badge = {
        id: 'badge-1',
        name: 'Champions League',
        season: '2024/2025',
        quantity: 50,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useBadgesStore.setState({ badges: [originalBadge] });

      const { updateBadge } = useBadgesStore.getState();
      updateBadge('non-existent', { name: 'New Badge' });

      const state = useBadgesStore.getState();
      expect(state.badges[0]).toEqual(originalBadge);
    });
  });

  describe('DELETE Operations', () => {
    test('should delete a badge from active badges', () => {
      const badges: Badge[] = [
        {
          id: 'badge-1',
          name: 'Champions League',
          season: '2024/2025',
          quantity: 50,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'badge-2',
          name: 'La Liga',
          season: '2024/2025',
          quantity: 30,
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      useBadgesStore.setState({ badges });

      const { deleteBadge } = useBadgesStore.getState();
      deleteBadge('badge-1');

      const state = useBadgesStore.getState();
      expect(state.badges).toHaveLength(1);
      expect(state.badges[0].id).toBe('badge-2');
    });

    test('should delete a badge from both active and archived badges', () => {
      const badges: Badge[] = [
        {
          id: 'badge-1',
          name: 'Champions League',
          season: '2024/2025',
          quantity: 50,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const archivedBadges: Badge[] = [
        {
          id: 'badge-2',
          name: 'La Liga',
          season: '2023/2024',
          quantity: 0,
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      useBadgesStore.setState({ badges, archivedBadges });

      const { deleteBadge } = useBadgesStore.getState();
      deleteBadge('badge-1');
      deleteBadge('badge-2');

      const state = useBadgesStore.getState();
      expect(state.badges).toHaveLength(0);
      expect(state.archivedBadges).toHaveLength(0);
    });
  });

  describe('ARCHIVE Operations', () => {
    test('should archive a badge', () => {
      const badge: Badge = {
        id: 'badge-1',
        name: 'Champions League',
        season: '2024/2025',
        quantity: 50,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useBadgesStore.setState({ badges: [badge], archivedBadges: [] });

      const { archiveBadge } = useBadgesStore.getState();
      archiveBadge('badge-1');

      const state = useBadgesStore.getState();
      expect(state.badges).toHaveLength(0);
      expect(state.archivedBadges).toHaveLength(1);
      expect(state.archivedBadges[0]).toEqual(badge);
    });

    test('should restore an archived badge', () => {
      const badge: Badge = {
        id: 'badge-1',
        name: 'Champions League',
        season: '2024/2025',
        quantity: 50,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useBadgesStore.setState({ badges: [], archivedBadges: [badge] });

      const { restoreBadge } = useBadgesStore.getState();
      restoreBadge('badge-1');

      const state = useBadgesStore.getState();
      expect(state.badges).toHaveLength(1);
      expect(state.archivedBadges).toHaveLength(0);
      expect(state.badges[0]).toEqual(badge);
    });
  });

  describe('SET Operations', () => {
    test('should set badges array', () => {
      const newBadges: Badge[] = [
        {
          id: 'badge-1',
          name: 'Champions League',
          season: '2024/2025',
          quantity: 50,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'badge-2',
          name: 'La Liga',
          season: '2024/2025',
          quantity: 30,
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      const { setBadges } = useBadgesStore.getState();
      setBadges(newBadges);

      const state = useBadgesStore.getState();
      expect(state.badges).toEqual(newBadges);
    });

    test('should set archived badges array', () => {
      const newArchivedBadges: Badge[] = [
        {
          id: 'badge-1',
          name: 'Champions League',
          season: '2023/2024',
          quantity: 0,
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      const { setArchivedBadges } = useBadgesStore.getState();
      setArchivedBadges(newArchivedBadges);

      const state = useBadgesStore.getState();
      expect(state.archivedBadges).toEqual(newArchivedBadges);
    });
  });

  describe('Data Integrity', () => {
    test('should maintain data consistency during operations', () => {
      const badge: Badge = {
        id: 'badge-1',
        name: 'Champions League',
        season: '2024/2025',
        quantity: 50,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addBadge, archiveBadge, restoreBadge } = useBadgesStore.getState();
      
      // Add badge
      addBadge(badge);
      expect(useBadgesStore.getState().badges).toHaveLength(1);
      
      // Archive badge
      archiveBadge('badge-1');
      expect(useBadgesStore.getState().badges).toHaveLength(0);
      expect(useBadgesStore.getState().archivedBadges).toHaveLength(1);
      
      // Restore badge
      restoreBadge('badge-1');
      expect(useBadgesStore.getState().badges).toHaveLength(1);
      expect(useBadgesStore.getState().archivedBadges).toHaveLength(0);
    });

    test('should handle complex badge data correctly', () => {
      const complexBadge: Badge = {
        id: 'badge-champions-2025',
        name: 'UEFA Champions League 2024/2025',
        season: '2024/2025',
        quantity: 100,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addBadge, updateBadge } = useBadgesStore.getState();
      
      addBadge(complexBadge);
      expect(useBadgesStore.getState().badges[0]).toEqual(complexBadge);
      
      // Update with new season and quantity
      updateBadge('badge-champions-2025', {
        season: '2025/2026',
        quantity: 150,
        name: 'UEFA Champions League 2025/2026'
      });
      
      const updatedBadge = useBadgesStore.getState().badges[0];
      expect(updatedBadge.season).toBe('2025/2026');
      expect(updatedBadge.quantity).toBe(150);
      expect(updatedBadge.name).toBe('UEFA Champions League 2025/2026');
    });

    test('should handle quantity updates correctly', () => {
      const badge: Badge = {
        id: 'badge-1',
        name: 'Champions League',
        season: '2024/2025',
        quantity: 50,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addBadge, updateBadge } = useBadgesStore.getState();
      
      addBadge(badge);
      
      // Simulate selling badges (decreasing quantity)
      updateBadge('badge-1', { quantity: 45 });
      expect(useBadgesStore.getState().badges[0].quantity).toBe(45);
      
      // Simulate restocking (increasing quantity)
      updateBadge('badge-1', { quantity: 60 });
      expect(useBadgesStore.getState().badges[0].quantity).toBe(60);
    });
  });
});

