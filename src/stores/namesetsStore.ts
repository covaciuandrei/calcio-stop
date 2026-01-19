import { useMemo } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import * as db from '../lib/db';
import { Nameset, NamesetImage } from '../types';
import { getErrorMessage, isForeignKeyConstraintError } from '../utils/errorHandler';

interface NamesetsState {
  // State
  namesets: Nameset[];
  archivedNamesets: Nameset[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addNameset: (nameset: Omit<Nameset, 'id' | 'createdAt'>) => Promise<void>;
  updateNameset: (id: string, updates: Partial<Nameset>) => Promise<void>;
  deleteNameset: (id: string) => Promise<void>;
  archiveNameset: (id: string) => Promise<void>;
  restoreNameset: (id: string) => Promise<void>;
  setNamesets: (namesets: Nameset[]) => void;
  setArchivedNamesets: (namesets: Nameset[]) => void;
  loadNamesets: () => Promise<void>;
  loadArchivedNamesets: () => Promise<void>;
  clearError: () => void;
  // Image management actions
  updateNamesetImages: (namesetId: string, images: NamesetImage[]) => void;
  addNamesetImage: (namesetId: string, image: NamesetImage) => void;
  removeNamesetImage: (namesetId: string, imageId: string) => void;
  refreshNameset: (namesetId: string) => Promise<void>;
}

// Selectors
export const namesetsSelectors = {
  getNamesetById: (state: NamesetsState, id: string) => state.namesets.find((n) => n.id === id),
  getNamesetsByPlayer: (state: NamesetsState, playerName: string) =>
    state.namesets.filter((n) => n.playerName.toLowerCase().includes(playerName.toLowerCase())),
  getNamesetsByNumber: (state: NamesetsState, number: number) => state.namesets.filter((n) => n.number === number),
  getNamesetsBySeason: (state: NamesetsState, season: string) => state.namesets.filter((n) => n.season === season),
  getAvailableNamesets: (state: NamesetsState) => state.namesets.filter((n) => n.quantity > 0),
  getSoldOutNamesets: (state: NamesetsState) => state.namesets.filter((n) => n.quantity === 0),
  getTotalNamesets: (state: NamesetsState) => state.namesets.length,
  getTotalArchivedNamesets: (state: NamesetsState) => state.archivedNamesets.length,
};

// Store
export const useNamesetsStore = create<NamesetsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      namesets: [],
      archivedNamesets: [],
      isLoading: false,
      error: null,

      // Actions
      addNameset: async (namesetData: Omit<Nameset, 'id' | 'createdAt'>) => {
        set({ isLoading: true, error: null });
        try {
          const newNameset = await db.createNameset({
            ...namesetData,
            createdAt: new Date().toISOString(),
          });
          set((state) => ({
            namesets: [...state.namesets, newNameset],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add nameset',
            isLoading: false,
          });
        }
      },

      updateNameset: async (id: string, updates: Partial<Nameset>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedNameset = await db.updateNameset(id, updates);
          set((state) => ({
            namesets: state.namesets.map((n) => (n.id === id ? updatedNameset : n)),
            archivedNamesets: state.archivedNamesets.map((n) => (n.id === id ? updatedNameset : n)),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update nameset',
            isLoading: false,
          });
        }
      },

      deleteNameset: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await db.deleteNameset(id);
          set((state) => ({
            namesets: state.namesets.filter((n) => n.id !== id),
            archivedNamesets: state.archivedNamesets.filter((n) => n.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = getErrorMessage(error as Error, 'delete', 'nameset');
          set({
            error: errorMessage,
            isLoading: false,
          });

          // If it's a foreign key constraint, suggest archiving instead
          if (isForeignKeyConstraintError(error as Error)) {
            console.warn('Foreign key constraint detected. Consider archiving instead of deleting.');
          }
        }
      },

      archiveNameset: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const archivedNameset = await db.archiveNameset(id);
          set((state) => ({
            namesets: state.namesets.filter((n) => n.id !== id),
            archivedNamesets: [...state.archivedNamesets, archivedNameset],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to archive nameset',
            isLoading: false,
          });
        }
      },

      restoreNameset: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const restoredNameset = await db.restoreNameset(id);
          set((state) => ({
            archivedNamesets: state.archivedNamesets.filter((n) => n.id !== id),
            namesets: [...state.namesets, restoredNameset],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to restore nameset',
            isLoading: false,
          });
        }
      },

      setNamesets: (namesets: Nameset[]) => {
        set({ namesets });
      },

      setArchivedNamesets: (archivedNamesets: Nameset[]) => {
        set({ archivedNamesets });
      },

      loadNamesets: async () => {
        set({ isLoading: true, error: null });
        try {
          const namesets = await db.getNamesets();
          set({ namesets, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load namesets',
            isLoading: false,
          });
        }
      },

      loadArchivedNamesets: async () => {
        set({ isLoading: true, error: null });
        try {
          const archivedNamesets = await db.getArchivedNamesets();
          set({ archivedNamesets, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load archived namesets',
            isLoading: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      // Image management actions
      updateNamesetImages: (namesetId: string, images: NamesetImage[]) => {
        set((state) => ({
          namesets: state.namesets.map((n) => (n.id === namesetId ? { ...n, images } : n)),
          archivedNamesets: state.archivedNamesets.map((n) => (n.id === namesetId ? { ...n, images } : n)),
        }));
      },

      addNamesetImage: (namesetId: string, image: NamesetImage) => {
        set((state) => ({
          namesets: state.namesets.map((n) =>
            n.id === namesetId ? { ...n, images: [...(n.images || []), image] } : n
          ),
          archivedNamesets: state.archivedNamesets.map((n) =>
            n.id === namesetId ? { ...n, images: [...(n.images || []), image] } : n
          ),
        }));
      },

      removeNamesetImage: (namesetId: string, imageId: string) => {
        set((state) => ({
          namesets: state.namesets.map((n) =>
            n.id === namesetId ? { ...n, images: (n.images || []).filter((img) => img.id !== imageId) } : n
          ),
          archivedNamesets: state.archivedNamesets.map((n) =>
            n.id === namesetId ? { ...n, images: (n.images || []).filter((img) => img.id !== imageId) } : n
          ),
        }));
      },

      refreshNameset: async (namesetId: string) => {
        try {
          // Reload all namesets to get the latest data
          const namesets = await db.getNamesets();
          const archivedNamesets = await db.getArchivedNamesets();
          set({ namesets, archivedNamesets });
        } catch (error) {
          console.error('Failed to refresh nameset:', error);
        }
      },
    }),
    {
      name: 'namesets-store',
    }
  )
);

// Typed selectors for easier usage
export const useNamesets = () => useNamesetsStore();
export const useNamesetsList = () => useNamesetsStore((state) => state.namesets);
export const useArchivedNamesets = () => useNamesetsStore((state) => state.archivedNamesets);
export const useSoldOutNamesets = () => {
  const namesets = useNamesetsStore(useShallow((state) => state.namesets));
  return useMemo(
    () => namesets.filter((n) => n.quantity === 0),
    [namesets]
  );
};
export const useNamesetsLoading = () => useNamesetsStore((state) => state.isLoading);
export const useNamesetsActions = () => ({
  addNameset: useNamesetsStore.getState().addNameset,
  updateNameset: useNamesetsStore.getState().updateNameset,
  deleteNameset: useNamesetsStore.getState().deleteNameset,
  archiveNameset: useNamesetsStore.getState().archiveNameset,
  restoreNameset: useNamesetsStore.getState().restoreNameset,
  setNamesets: useNamesetsStore.getState().setNamesets,
  setArchivedNamesets: useNamesetsStore.getState().setArchivedNamesets,
  loadNamesets: useNamesetsStore.getState().loadNamesets,
  loadArchivedNamesets: useNamesetsStore.getState().loadArchivedNamesets,
  // Image management actions
  updateNamesetImages: useNamesetsStore.getState().updateNamesetImages,
  addNamesetImage: useNamesetsStore.getState().addNamesetImage,
  removeNamesetImage: useNamesetsStore.getState().removeNamesetImage,
  refreshNameset: useNamesetsStore.getState().refreshNameset,
});
