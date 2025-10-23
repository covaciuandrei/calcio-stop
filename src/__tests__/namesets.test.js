/**
 * @jest-environment jsdom
 */

import 'jest-localstorage-mock';
import { useNamesetsStore } from '../stores/namesetsStore';
import { Nameset } from '../types';

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

describe('Namesets Store CRUD Operations', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Reset store state
    useNamesetsStore.setState({
      namesets: [],
      archivedNamesets: [],
    });
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('CREATE Operations', () => {
    test('should add a new nameset to the store', () => {
      const newNameset: Nameset = {
        id: 'nameset-1',
        playerName: 'Messi',
        number: 10,
        season: '2024/2025',
        quantity: 25,
        kitTypeId: 'kit-type-1',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addNameset } = useNamesetsStore.getState();
      addNameset(newNameset);

      const state = useNamesetsStore.getState();
      expect(state.namesets).toHaveLength(1);
      expect(state.namesets[0]).toEqual(newNameset);
    });

    test('should add multiple namesets without duplicates', () => {
      const nameset1: Nameset = {
        id: 'nameset-1',
        playerName: 'Messi',
        number: 10,
        season: '2024/2025',
        quantity: 25,
        kitTypeId: 'kit-type-1',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const nameset2: Nameset = {
        id: 'nameset-2',
        playerName: 'Ronaldo',
        number: 7,
        season: '2024/2025',
        quantity: 30,
        kitTypeId: 'kit-type-1',
        createdAt: '2024-01-02T00:00:00.000Z',
      };

      const { addNameset } = useNamesetsStore.getState();
      addNameset(nameset1);
      addNameset(nameset2);

      const state = useNamesetsStore.getState();
      expect(state.namesets).toHaveLength(2);
      expect(state.namesets).toContainEqual(nameset1);
      expect(state.namesets).toContainEqual(nameset2);
    });
  });

  describe('READ Operations', () => {
    test('should return all namesets', () => {
      const namesets: Nameset[] = [
        {
          id: 'nameset-1',
          playerName: 'Messi',
          number: 10,
          season: '2024/2025',
          quantity: 25,
          kitTypeId: 'kit-type-1',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'nameset-2',
          playerName: 'Ronaldo',
          number: 7,
          season: '2024/2025',
          quantity: 30,
          kitTypeId: 'kit-type-1',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      useNamesetsStore.setState({ namesets });

      const state = useNamesetsStore.getState();
      expect(state.namesets).toEqual(namesets);
    });

    test('should return archived namesets', () => {
      const archivedNamesets: Nameset[] = [
        {
          id: 'nameset-1',
          playerName: 'Messi',
          number: 10,
          season: '2023/2024',
          quantity: 0,
          kitTypeId: 'kit-type-1',
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      useNamesetsStore.setState({ archivedNamesets });

      const state = useNamesetsStore.getState();
      expect(state.archivedNamesets).toEqual(archivedNamesets);
    });
  });

  describe('UPDATE Operations', () => {
    test('should update an existing nameset', () => {
      const originalNameset: Nameset = {
        id: 'nameset-1',
        playerName: 'Messi',
        number: 10,
        season: '2024/2025',
        quantity: 25,
        kitTypeId: 'kit-type-1',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useNamesetsStore.setState({ namesets: [originalNameset] });

      const { updateNameset } = useNamesetsStore.getState();
      updateNameset('nameset-1', { 
        playerName: 'Lionel Messi',
        quantity: 30
      });

      const state = useNamesetsStore.getState();
      expect(state.namesets[0].playerName).toBe('Lionel Messi');
      expect(state.namesets[0].quantity).toBe(30);
      expect(state.namesets[0].id).toBe('nameset-1');
      expect(state.namesets[0].createdAt).toBe(originalNameset.createdAt);
    });

    test('should update nameset number and season', () => {
      const originalNameset: Nameset = {
        id: 'nameset-1',
        playerName: 'Messi',
        number: 10,
        season: '2024/2025',
        quantity: 25,
        kitTypeId: 'kit-type-1',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useNamesetsStore.setState({ namesets: [originalNameset] });

      const { updateNameset } = useNamesetsStore.getState();
      updateNameset('nameset-1', { 
        number: 30,
        season: '2025/2026'
      });

      const state = useNamesetsStore.getState();
      expect(state.namesets[0].number).toBe(30);
      expect(state.namesets[0].season).toBe('2025/2026');
    });

    test('should update kit type reference', () => {
      const originalNameset: Nameset = {
        id: 'nameset-1',
        playerName: 'Messi',
        number: 10,
        season: '2024/2025',
        quantity: 25,
        kitTypeId: 'kit-type-1',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useNamesetsStore.setState({ namesets: [originalNameset] });

      const { updateNameset } = useNamesetsStore.getState();
      updateNameset('nameset-1', { 
        kitTypeId: 'kit-type-2'
      });

      const state = useNamesetsStore.getState();
      expect(state.namesets[0].kitTypeId).toBe('kit-type-2');
    });

    test('should not update non-existent nameset', () => {
      const originalNameset: Nameset = {
        id: 'nameset-1',
        playerName: 'Messi',
        number: 10,
        season: '2024/2025',
        quantity: 25,
        kitTypeId: 'kit-type-1',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useNamesetsStore.setState({ namesets: [originalNameset] });

      const { updateNameset } = useNamesetsStore.getState();
      updateNameset('non-existent', { playerName: 'New Player' });

      const state = useNamesetsStore.getState();
      expect(state.namesets[0]).toEqual(originalNameset);
    });
  });

  describe('DELETE Operations', () => {
    test('should delete a nameset from active namesets', () => {
      const namesets: Nameset[] = [
        {
          id: 'nameset-1',
          playerName: 'Messi',
          number: 10,
          season: '2024/2025',
          quantity: 25,
          kitTypeId: 'kit-type-1',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'nameset-2',
          playerName: 'Ronaldo',
          number: 7,
          season: '2024/2025',
          quantity: 30,
          kitTypeId: 'kit-type-1',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      useNamesetsStore.setState({ namesets });

      const { deleteNameset } = useNamesetsStore.getState();
      deleteNameset('nameset-1');

      const state = useNamesetsStore.getState();
      expect(state.namesets).toHaveLength(1);
      expect(state.namesets[0].id).toBe('nameset-2');
    });

    test('should delete a nameset from both active and archived namesets', () => {
      const namesets: Nameset[] = [
        {
          id: 'nameset-1',
          playerName: 'Messi',
          number: 10,
          season: '2024/2025',
          quantity: 25,
          kitTypeId: 'kit-type-1',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const archivedNamesets: Nameset[] = [
        {
          id: 'nameset-2',
          playerName: 'Ronaldo',
          number: 7,
          season: '2023/2024',
          quantity: 0,
          kitTypeId: 'kit-type-1',
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      useNamesetsStore.setState({ namesets, archivedNamesets });

      const { deleteNameset } = useNamesetsStore.getState();
      deleteNameset('nameset-1');
      deleteNameset('nameset-2');

      const state = useNamesetsStore.getState();
      expect(state.namesets).toHaveLength(0);
      expect(state.archivedNamesets).toHaveLength(0);
    });
  });

  describe('ARCHIVE Operations', () => {
    test('should archive a nameset', () => {
      const nameset: Nameset = {
        id: 'nameset-1',
        playerName: 'Messi',
        number: 10,
        season: '2024/2025',
        quantity: 25,
        kitTypeId: 'kit-type-1',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useNamesetsStore.setState({ namesets: [nameset], archivedNamesets: [] });

      const { archiveNameset } = useNamesetsStore.getState();
      archiveNameset('nameset-1');

      const state = useNamesetsStore.getState();
      expect(state.namesets).toHaveLength(0);
      expect(state.archivedNamesets).toHaveLength(1);
      expect(state.archivedNamesets[0]).toEqual(nameset);
    });

    test('should restore an archived nameset', () => {
      const nameset: Nameset = {
        id: 'nameset-1',
        playerName: 'Messi',
        number: 10,
        season: '2024/2025',
        quantity: 25,
        kitTypeId: 'kit-type-1',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useNamesetsStore.setState({ namesets: [], archivedNamesets: [nameset] });

      const { restoreNameset } = useNamesetsStore.getState();
      restoreNameset('nameset-1');

      const state = useNamesetsStore.getState();
      expect(state.namesets).toHaveLength(1);
      expect(state.archivedNamesets).toHaveLength(0);
      expect(state.namesets[0]).toEqual(nameset);
    });
  });

  describe('SET Operations', () => {
    test('should set namesets array', () => {
      const newNamesets: Nameset[] = [
        {
          id: 'nameset-1',
          playerName: 'Messi',
          number: 10,
          season: '2024/2025',
          quantity: 25,
          kitTypeId: 'kit-type-1',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'nameset-2',
          playerName: 'Ronaldo',
          number: 7,
          season: '2024/2025',
          quantity: 30,
          kitTypeId: 'kit-type-1',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      const { setNamesets } = useNamesetsStore.getState();
      setNamesets(newNamesets);

      const state = useNamesetsStore.getState();
      expect(state.namesets).toEqual(newNamesets);
    });

    test('should set archived namesets array', () => {
      const newArchivedNamesets: Nameset[] = [
        {
          id: 'nameset-1',
          playerName: 'Messi',
          number: 10,
          season: '2023/2024',
          quantity: 0,
          kitTypeId: 'kit-type-1',
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      const { setArchivedNamesets } = useNamesetsStore.getState();
      setArchivedNamesets(newArchivedNamesets);

      const state = useNamesetsStore.getState();
      expect(state.archivedNamesets).toEqual(newArchivedNamesets);
    });
  });

  describe('Data Integrity', () => {
    test('should maintain data consistency during operations', () => {
      const nameset: Nameset = {
        id: 'nameset-1',
        playerName: 'Messi',
        number: 10,
        season: '2024/2025',
        quantity: 25,
        kitTypeId: 'kit-type-1',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addNameset, archiveNameset, restoreNameset } = useNamesetsStore.getState();
      
      // Add nameset
      addNameset(nameset);
      expect(useNamesetsStore.getState().namesets).toHaveLength(1);
      
      // Archive nameset
      archiveNameset('nameset-1');
      expect(useNamesetsStore.getState().namesets).toHaveLength(0);
      expect(useNamesetsStore.getState().archivedNamesets).toHaveLength(1);
      
      // Restore nameset
      restoreNameset('nameset-1');
      expect(useNamesetsStore.getState().namesets).toHaveLength(1);
      expect(useNamesetsStore.getState().archivedNamesets).toHaveLength(0);
    });

    test('should handle complex nameset data correctly', () => {
      const complexNameset: Nameset = {
        id: 'nameset-messi-2025',
        playerName: 'Lionel Andrés Messi',
        number: 10,
        season: '2024/2025',
        quantity: 50,
        kitTypeId: 'kit-type-champions',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addNameset, updateNameset } = useNamesetsStore.getState();
      
      addNameset(complexNameset);
      expect(useNamesetsStore.getState().namesets[0]).toEqual(complexNameset);
      
      // Update with new season and quantity
      updateNameset('nameset-messi-2025', {
        season: '2025/2026',
        quantity: 75,
        number: 30
      });
      
      const updatedNameset = useNamesetsStore.getState().namesets[0];
      expect(updatedNameset.season).toBe('2025/2026');
      expect(updatedNameset.quantity).toBe(75);
      expect(updatedNameset.number).toBe(30);
    });

    test('should handle quantity updates correctly', () => {
      const nameset: Nameset = {
        id: 'nameset-1',
        playerName: 'Messi',
        number: 10,
        season: '2024/2025',
        quantity: 25,
        kitTypeId: 'kit-type-1',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addNameset, updateNameset } = useNamesetsStore.getState();
      
      addNameset(nameset);
      
      // Simulate selling namesets (decreasing quantity)
      updateNameset('nameset-1', { quantity: 20 });
      expect(useNamesetsStore.getState().namesets[0].quantity).toBe(20);
      
      // Simulate restocking (increasing quantity)
      updateNameset('nameset-1', { quantity: 35 });
      expect(useNamesetsStore.getState().namesets[0].quantity).toBe(35);
    });

    test('should handle multiple namesets for same player', () => {
      const nameset1: Nameset = {
        id: 'nameset-1',
        playerName: 'Messi',
        number: 10,
        season: '2024/2025',
        quantity: 25,
        kitTypeId: 'kit-type-1',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const nameset2: Nameset = {
        id: 'nameset-2',
        playerName: 'Messi',
        number: 10,
        season: '2023/2024',
        quantity: 15,
        kitTypeId: 'kit-type-1',
        createdAt: '2023-01-01T00:00:00.000Z',
      };

      const { addNameset } = useNamesetsStore.getState();
      
      addNameset(nameset1);
      addNameset(nameset2);
      
      const state = useNamesetsStore.getState();
      expect(state.namesets).toHaveLength(2);
      expect(state.namesets.every(nameset => nameset.playerName === 'Messi')).toBe(true);
    });
  });
});

