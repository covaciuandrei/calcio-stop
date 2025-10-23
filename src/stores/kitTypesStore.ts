import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { isDefaultKitType } from '../constants/kitTypes';
import * as db from '../lib/db';
import { KitType } from '../types';

interface KitTypesState {
  // State
  kitTypes: KitType[];
  archivedKitTypes: KitType[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addKitType: (kitType: Omit<KitType, 'id' | 'createdAt'>) => Promise<void>;
  updateKitType: (id: string, updates: Partial<KitType>) => Promise<void>;
  deleteKitType: (id: string) => Promise<void>;
  archiveKitType: (id: string) => Promise<void>;
  restoreKitType: (id: string) => Promise<void>;
  setKitTypes: (kitTypes: KitType[]) => void;
  setArchivedKitTypes: (kitTypes: KitType[]) => void;
  loadKitTypes: () => Promise<void>;
  loadArchivedKitTypes: () => Promise<void>;
  clearError: () => void;
}

// Selectors
export const kitTypesSelectors = {
  getKitTypeById: (state: KitTypesState, id: string) => state.kitTypes.find((kt) => kt.id === id),
  getKitTypesByName: (state: KitTypesState, name: string) =>
    state.kitTypes.filter((kt) => kt.name.toLowerCase().includes(name.toLowerCase())),
  getTotalKitTypes: (state: KitTypesState) => state.kitTypes.length,
  getTotalArchivedKitTypes: (state: KitTypesState) => state.archivedKitTypes.length,
};

// Default kit types with fixed IDs - all have the same creation date
const defaultCreationDate = new Date('2024-01-01T00:00:00.000Z').toISOString();

const defaultKitTypes: KitType[] = [
  { id: 'default-kit-type-1st', name: '1st Kit', createdAt: defaultCreationDate },
  { id: 'default-kit-type-2nd', name: '2nd Kit', createdAt: defaultCreationDate },
  { id: 'default-kit-type-3rd', name: '3rd Kit', createdAt: defaultCreationDate },
  { id: 'default-kit-type-none', name: 'None', createdAt: defaultCreationDate },
];

// Store
export const useKitTypesStore = create<KitTypesState>()(
  devtools(
    (set, get) => ({
      // Initial state with default kit types
      kitTypes: defaultKitTypes,
      archivedKitTypes: [],
      isLoading: false,
      error: null,

      // Actions
      addKitType: async (kitTypeData: Omit<KitType, 'id' | 'createdAt'>) => {
        set({ isLoading: true, error: null });
        try {
          const newKitType = await db.createKitType({
            ...kitTypeData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          });
          set((state) => ({
            kitTypes: [...state.kitTypes, newKitType],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add kit type',
            isLoading: false,
          });
        }
      },

      updateKitType: async (id: string, updates: Partial<KitType>) => {
        // Prevent editing of default kit types
        if (isDefaultKitType(id)) {
          console.warn('Cannot edit default kit types');
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const updatedKitType = await db.updateKitType(id, updates);
          set((state) => ({
            kitTypes: state.kitTypes.map((kt) => (kt.id === id ? updatedKitType : kt)),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update kit type',
            isLoading: false,
          });
        }
      },

      deleteKitType: async (id: string) => {
        // Prevent deletion of default kit types
        const kitType = get().kitTypes.find((kt) => kt.id === id) || get().archivedKitTypes.find((kt) => kt.id === id);
        if (kitType && isDefaultKitType(kitType)) {
          console.warn('Cannot delete default kit types');
          return;
        }

        set({ isLoading: true, error: null });
        try {
          await db.deleteKitType(id);
          set((state) => ({
            kitTypes: state.kitTypes.filter((kt) => kt.id !== id),
            archivedKitTypes: state.archivedKitTypes.filter((kt) => kt.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete kit type',
            isLoading: false,
          });
        }
      },

      archiveKitType: async (id: string) => {
        // Prevent archiving of default kit types
        const kitType = get().kitTypes.find((kt) => kt.id === id);
        if (kitType && isDefaultKitType(kitType)) {
          console.warn('Cannot archive default kit types');
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const archivedKitType = await db.archiveKitType(id);
          set((state) => ({
            kitTypes: state.kitTypes.filter((kt) => kt.id !== id),
            archivedKitTypes: [...state.archivedKitTypes, archivedKitType],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to archive kit type',
            isLoading: false,
          });
        }
      },

      restoreKitType: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const restoredKitType = await db.restoreKitType(id);
          set((state) => ({
            archivedKitTypes: state.archivedKitTypes.filter((kt) => kt.id !== id),
            kitTypes: [...state.kitTypes, restoredKitType],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to restore kit type',
            isLoading: false,
          });
        }
      },

      setKitTypes: (kitTypes: KitType[]) => {
        set({ kitTypes });
      },

      setArchivedKitTypes: (archivedKitTypes: KitType[]) => {
        set({ archivedKitTypes });
      },

      loadKitTypes: async () => {
        set({ isLoading: true, error: null });
        try {
          const kitTypes = await db.getKitTypes();
          set({ kitTypes, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load kit types',
            isLoading: false,
          });
        }
      },

      loadArchivedKitTypes: async () => {
        set({ isLoading: true, error: null });
        try {
          const archivedKitTypes = await db.getArchivedKitTypes();
          set({ archivedKitTypes, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load archived kit types',
            isLoading: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'kit-types-store',
    }
  )
);

// Typed selectors for easier usage
export const useKitTypes = () => useKitTypesStore();
export const useKitTypesList = () => useKitTypesStore((state) => state.kitTypes);
export const useArchivedKitTypes = () => useKitTypesStore((state) => state.archivedKitTypes);
export const useKitTypesActions = () => ({
  addKitType: useKitTypesStore.getState().addKitType,
  updateKitType: useKitTypesStore.getState().updateKitType,
  deleteKitType: useKitTypesStore.getState().deleteKitType,
  archiveKitType: useKitTypesStore.getState().archiveKitType,
  restoreKitType: useKitTypesStore.getState().restoreKitType,
  setKitTypes: useKitTypesStore.getState().setKitTypes,
  setArchivedKitTypes: useKitTypesStore.getState().setArchivedKitTypes,
  loadKitTypes: useKitTypesStore.getState().loadKitTypes,
  loadArchivedKitTypes: useKitTypesStore.getState().loadArchivedKitTypes,
  clearError: useKitTypesStore.getState().clearError,
});
