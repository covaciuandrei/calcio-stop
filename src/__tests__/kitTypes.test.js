/**
 * @jest-environment jsdom
 */

import 'jest-localstorage-mock';
import { useKitTypesStore } from '../stores/kitTypesStore';
import { KitType } from '../types';

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

describe('KitTypes Store CRUD Operations', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Reset store state
    useKitTypesStore.setState({
      kitTypes: [],
      archivedKitTypes: [],
    });
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('CREATE Operations', () => {
    test('should add a new kit type to the store', () => {
      const newKitType: KitType = {
        id: 'kit-type-1',
        name: 'Retro Kit',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addKitType } = useKitTypesStore.getState();
      addKitType(newKitType);

      const state = useKitTypesStore.getState();
      expect(state.kitTypes).toHaveLength(1);
      expect(state.kitTypes[0]).toEqual(newKitType);
    });

    test('should add multiple kit types without duplicates', () => {
      const kitType1: KitType = {
        id: 'kit-type-1',
        name: 'Retro Kit',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const kitType2: KitType = {
        id: 'kit-type-2',
        name: 'Special Edition',
        createdAt: '2024-01-02T00:00:00.000Z',
      };

      const { addKitType } = useKitTypesStore.getState();
      addKitType(kitType1);
      addKitType(kitType2);

      const state = useKitTypesStore.getState();
      expect(state.kitTypes).toHaveLength(2);
      expect(state.kitTypes).toContainEqual(kitType1);
      expect(state.kitTypes).toContainEqual(kitType2);
    });
  });

  describe('READ Operations', () => {
    test('should return all kit types', () => {
      const kitTypes: KitType[] = [
        {
          id: 'kit-type-1',
          name: 'Retro Kit',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'kit-type-2',
          name: 'Special Edition',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      useKitTypesStore.setState({ kitTypes });

      const state = useKitTypesStore.getState();
      expect(state.kitTypes).toEqual(kitTypes);
    });

    test('should return archived kit types', () => {
      const archivedKitTypes: KitType[] = [
        {
          id: 'kit-type-1',
          name: 'Old Kit',
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      useKitTypesStore.setState({ archivedKitTypes });

      const state = useKitTypesStore.getState();
      expect(state.archivedKitTypes).toEqual(archivedKitTypes);
    });
  });

  describe('UPDATE Operations', () => {
    test('should update an existing kit type', () => {
      const originalKitType: KitType = {
        id: 'kit-type-1',
        name: 'Retro Kit',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useKitTypesStore.setState({ kitTypes: [originalKitType] });

      const { updateKitType } = useKitTypesStore.getState();
      updateKitType('kit-type-1', { 
        name: 'Vintage Retro Kit'
      });

      const state = useKitTypesStore.getState();
      expect(state.kitTypes[0].name).toBe('Vintage Retro Kit');
      expect(state.kitTypes[0].id).toBe('kit-type-1');
      expect(state.kitTypes[0].createdAt).toBe(originalKitType.createdAt);
    });

    test('should not update non-existent kit type', () => {
      const originalKitType: KitType = {
        id: 'kit-type-1',
        name: 'Retro Kit',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useKitTypesStore.setState({ kitTypes: [originalKitType] });

      const { updateKitType } = useKitTypesStore.getState();
      updateKitType('non-existent', { name: 'New Kit Type' });

      const state = useKitTypesStore.getState();
      expect(state.kitTypes[0]).toEqual(originalKitType);
    });
  });

  describe('DELETE Operations', () => {
    test('should delete a kit type from active kit types', () => {
      const kitTypes: KitType[] = [
        {
          id: 'kit-type-1',
          name: 'Retro Kit',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'kit-type-2',
          name: 'Special Edition',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      useKitTypesStore.setState({ kitTypes });

      const { deleteKitType } = useKitTypesStore.getState();
      deleteKitType('kit-type-1');

      const state = useKitTypesStore.getState();
      expect(state.kitTypes).toHaveLength(1);
      expect(state.kitTypes[0].id).toBe('kit-type-2');
    });

    test('should delete a kit type from both active and archived kit types', () => {
      const kitTypes: KitType[] = [
        {
          id: 'kit-type-1',
          name: 'Retro Kit',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const archivedKitTypes: KitType[] = [
        {
          id: 'kit-type-2',
          name: 'Old Kit',
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      useKitTypesStore.setState({ kitTypes, archivedKitTypes });

      const { deleteKitType } = useKitTypesStore.getState();
      deleteKitType('kit-type-1');
      deleteKitType('kit-type-2');

      const state = useKitTypesStore.getState();
      expect(state.kitTypes).toHaveLength(0);
      expect(state.archivedKitTypes).toHaveLength(0);
    });
  });

  describe('ARCHIVE Operations', () => {
    test('should archive a kit type', () => {
      const kitType: KitType = {
        id: 'kit-type-1',
        name: 'Retro Kit',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useKitTypesStore.setState({ kitTypes: [kitType], archivedKitTypes: [] });

      const { archiveKitType } = useKitTypesStore.getState();
      archiveKitType('kit-type-1');

      const state = useKitTypesStore.getState();
      expect(state.kitTypes).toHaveLength(0);
      expect(state.archivedKitTypes).toHaveLength(1);
      expect(state.archivedKitTypes[0]).toEqual(kitType);
    });

    test('should restore an archived kit type', () => {
      const kitType: KitType = {
        id: 'kit-type-1',
        name: 'Retro Kit',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useKitTypesStore.setState({ kitTypes: [], archivedKitTypes: [kitType] });

      const { restoreKitType } = useKitTypesStore.getState();
      restoreKitType('kit-type-1');

      const state = useKitTypesStore.getState();
      expect(state.kitTypes).toHaveLength(1);
      expect(state.archivedKitTypes).toHaveLength(0);
      expect(state.kitTypes[0]).toEqual(kitType);
    });
  });

  describe('SET Operations', () => {
    test('should set kit types array', () => {
      const newKitTypes: KitType[] = [
        {
          id: 'kit-type-1',
          name: 'Retro Kit',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'kit-type-2',
          name: 'Special Edition',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      const { setKitTypes } = useKitTypesStore.getState();
      setKitTypes(newKitTypes);

      const state = useKitTypesStore.getState();
      expect(state.kitTypes).toEqual(newKitTypes);
    });

    test('should set archived kit types array', () => {
      const newArchivedKitTypes: KitType[] = [
        {
          id: 'kit-type-1',
          name: 'Old Kit',
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      const { setArchivedKitTypes } = useKitTypesStore.getState();
      setArchivedKitTypes(newArchivedKitTypes);

      const state = useKitTypesStore.getState();
      expect(state.archivedKitTypes).toEqual(newArchivedKitTypes);
    });
  });

  describe('Data Integrity', () => {
    test('should maintain data consistency during operations', () => {
      const kitType: KitType = {
        id: 'kit-type-1',
        name: 'Retro Kit',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addKitType, archiveKitType, restoreKitType } = useKitTypesStore.getState();
      
      // Add kit type
      addKitType(kitType);
      expect(useKitTypesStore.getState().kitTypes).toHaveLength(1);
      
      // Archive kit type
      archiveKitType('kit-type-1');
      expect(useKitTypesStore.getState().kitTypes).toHaveLength(0);
      expect(useKitTypesStore.getState().archivedKitTypes).toHaveLength(1);
      
      // Restore kit type
      restoreKitType('kit-type-1');
      expect(useKitTypesStore.getState().kitTypes).toHaveLength(1);
      expect(useKitTypesStore.getState().archivedKitTypes).toHaveLength(0);
    });

    test('should handle complex kit type data correctly', () => {
      const complexKitType: KitType = {
        id: 'kit-type-special-2025',
        name: 'Champions League Special Edition 2025',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addKitType, updateKitType } = useKitTypesStore.getState();
      
      addKitType(complexKitType);
      expect(useKitTypesStore.getState().kitTypes[0]).toEqual(complexKitType);
      
      // Update with new name
      updateKitType('kit-type-special-2025', {
        name: 'UEFA Champions League Special Edition 2025'
      });
      
      const updatedKitType = useKitTypesStore.getState().kitTypes[0];
      expect(updatedKitType.name).toBe('UEFA Champions League Special Edition 2025');
    });

    test('should handle multiple kit types correctly', () => {
      const kitType1: KitType = {
        id: 'kit-type-1',
        name: 'Home Kit',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const kitType2: KitType = {
        id: 'kit-type-2',
        name: 'Away Kit',
        createdAt: '2024-01-02T00:00:00.000Z',
      };

      const kitType3: KitType = {
        id: 'kit-type-3',
        name: 'Third Kit',
        createdAt: '2024-01-03T00:00:00.000Z',
      };

      const { addKitType, updateKitType, deleteKitType } = useKitTypesStore.getState();
      
      // Add multiple kit types
      addKitType(kitType1);
      addKitType(kitType2);
      addKitType(kitType3);
      
      expect(useKitTypesStore.getState().kitTypes).toHaveLength(3);
      
      // Update one kit type
      updateKitType('kit-type-2', { name: 'Away Kit 2025' });
      expect(useKitTypesStore.getState().kitTypes.find(kt => kt.id === 'kit-type-2')?.name).toBe('Away Kit 2025');
      
      // Delete one kit type
      deleteKitType('kit-type-3');
      expect(useKitTypesStore.getState().kitTypes).toHaveLength(2);
    });
  });
});

