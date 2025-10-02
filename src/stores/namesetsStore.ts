import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Nameset } from '../types';

interface NamesetsState {
  // State
  namesets: Nameset[];
  archivedNamesets: Nameset[];

  // Actions
  addNameset: (nameset: Nameset) => void;
  updateNameset: (id: string, updates: Partial<Nameset>) => void;
  deleteNameset: (id: string) => void;
  archiveNameset: (id: string) => void;
  restoreNameset: (id: string) => void;
  setNamesets: (namesets: Nameset[]) => void;
  setArchivedNamesets: (namesets: Nameset[]) => void;
}

// Selectors
export const namesetsSelectors = {
  getNamesetById: (state: NamesetsState, id: string) => state.namesets.find((n) => n.id === id),
  getNamesetsByPlayer: (state: NamesetsState, playerName: string) =>
    state.namesets.filter((n) => n.playerName.toLowerCase().includes(playerName.toLowerCase())),
  getNamesetsByNumber: (state: NamesetsState, number: number) => state.namesets.filter((n) => n.number === number),
  getNamesetsBySeason: (state: NamesetsState, season: string) => state.namesets.filter((n) => n.season === season),
  getAvailableNamesets: (state: NamesetsState) => state.namesets.filter((n) => n.quantity > 0),
  getTotalNamesets: (state: NamesetsState) => state.namesets.length,
  getTotalArchivedNamesets: (state: NamesetsState) => state.archivedNamesets.length,
};

// Store
export const useNamesetsStore = create<NamesetsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        namesets: [],
        archivedNamesets: [],

        // Actions
        addNameset: (nameset: Nameset) => {
          set((state) => ({
            namesets: [...state.namesets, nameset],
          }));
        },

        updateNameset: (id: string, updates: Partial<Nameset>) => {
          set((state) => ({
            namesets: state.namesets.map((n) => (n.id === id ? { ...n, ...updates } : n)),
          }));
        },

        deleteNameset: (id: string) => {
          set((state) => ({
            namesets: state.namesets.filter((n) => n.id !== id),
            archivedNamesets: state.archivedNamesets.filter((n) => n.id !== id),
          }));
        },

        archiveNameset: (id: string) => {
          const nameset = get().namesets.find((n) => n.id === id);
          if (nameset) {
            set((state) => ({
              namesets: state.namesets.filter((n) => n.id !== id),
              archivedNamesets: [...state.archivedNamesets, nameset],
            }));
          }
        },

        restoreNameset: (id: string) => {
          const nameset = get().archivedNamesets.find((n) => n.id === id);
          if (nameset) {
            set((state) => ({
              archivedNamesets: state.archivedNamesets.filter((n) => n.id !== id),
              namesets: [...state.namesets, nameset],
            }));
          }
        },

        setNamesets: (namesets: Nameset[]) => {
          set({ namesets });
        },

        setArchivedNamesets: (archivedNamesets: Nameset[]) => {
          set({ archivedNamesets });
        },
      }),
      {
        name: 'namesets-store',
        partialize: (state) => ({
          namesets: state.namesets,
          archivedNamesets: state.archivedNamesets,
        }),
      }
    ),
    {
      name: 'namesets-store',
    }
  )
);

// Typed selectors for easier usage
export const useNamesets = () => useNamesetsStore();
export const useNamesetsList = () => useNamesetsStore((state) => state.namesets);
export const useArchivedNamesets = () => useNamesetsStore((state) => state.archivedNamesets);
export const useNamesetsActions = () => ({
  addNameset: useNamesetsStore.getState().addNameset,
  updateNameset: useNamesetsStore.getState().updateNameset,
  deleteNameset: useNamesetsStore.getState().deleteNameset,
  archiveNameset: useNamesetsStore.getState().archiveNameset,
  restoreNameset: useNamesetsStore.getState().restoreNameset,
  setNamesets: useNamesetsStore.getState().setNamesets,
  setArchivedNamesets: useNamesetsStore.getState().setArchivedNamesets,
});
