import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as db from '../lib/db';
import { League } from '../types';
import { getErrorMessage, isForeignKeyConstraintError } from '../utils/errorHandler';

interface LeaguesState {
  // State
  leagues: League[];
  archivedLeagues: League[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addLeague: (league: Omit<League, 'id' | 'createdAt'>) => Promise<void>;
  updateLeague: (id: string, updates: Partial<League>) => Promise<void>;
  deleteLeague: (id: string) => Promise<void>;
  archiveLeague: (id: string) => Promise<void>;
  restoreLeague: (id: string) => Promise<void>;
  setLeagues: (leagues: League[]) => void;
  setArchivedLeagues: (leagues: League[]) => void;
  loadLeagues: () => Promise<void>;
  loadArchivedLeagues: () => Promise<void>;
  clearError: () => void;
}

// Selectors
export const leaguesSelectors = {
  getLeagueById: (state: LeaguesState, id: string) => state.leagues.find((l) => l.id === id),
  getLeaguesByName: (state: LeaguesState, name: string) =>
    state.leagues.filter((l) => l.name.toLowerCase().includes(name.toLowerCase())),
  getTotalLeagues: (state: LeaguesState) => state.leagues.length,
  getTotalArchivedLeagues: (state: LeaguesState) => state.archivedLeagues.length,
};

// Store
export const useLeaguesStore = create<LeaguesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      leagues: [],
      archivedLeagues: [],
      isLoading: false,
      error: null,

      // Actions
      addLeague: async (leagueData: Omit<League, 'id' | 'createdAt'>) => {
        set({ isLoading: true, error: null });
        try {
          const newLeague = await db.createLeague({
            ...leagueData,
            createdAt: new Date().toISOString(),
          });
          set((state) => ({
            leagues: [...state.leagues, newLeague],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add league',
            isLoading: false,
          });
        }
      },

      updateLeague: async (id: string, updates: Partial<League>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedLeague = await db.updateLeague(id, updates);
          set((state) => ({
            leagues: state.leagues.map((l) => (l.id === id ? updatedLeague : l)),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update league',
            isLoading: false,
          });
        }
      },

      deleteLeague: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await db.deleteLeague(id);
          set((state) => ({
            leagues: state.leagues.filter((l) => l.id !== id),
            archivedLeagues: state.archivedLeagues.filter((l) => l.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = getErrorMessage(error as Error, 'delete', 'league');
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

      archiveLeague: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const archivedLeague = await db.archiveLeague(id);
          set((state) => ({
            leagues: state.leagues.filter((l) => l.id !== id),
            archivedLeagues: [...state.archivedLeagues, archivedLeague],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to archive league',
            isLoading: false,
          });
        }
      },

      restoreLeague: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const restoredLeague = await db.restoreLeague(id);
          set((state) => ({
            archivedLeagues: state.archivedLeagues.filter((l) => l.id !== id),
            leagues: [...state.leagues, restoredLeague],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to restore league',
            isLoading: false,
          });
        }
      },

      setLeagues: (leagues: League[]) => {
        set({ leagues });
      },

      setArchivedLeagues: (archivedLeagues: League[]) => {
        set({ archivedLeagues });
      },

      loadLeagues: async () => {
        set({ isLoading: true, error: null });
        try {
          const leagues = await db.getLeagues();
          set({ leagues, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load leagues',
            isLoading: false,
          });
        }
      },

      loadArchivedLeagues: async () => {
        set({ isLoading: true, error: null });
        try {
          const archivedLeagues = await db.getArchivedLeagues();
          set({ archivedLeagues, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load archived leagues',
            isLoading: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'leagues-store',
    }
  )
);

// Typed selectors for easier usage
export const useLeagues = () => useLeaguesStore();
export const useLeaguesList = () => useLeaguesStore((state) => state.leagues);
export const useArchivedLeagues = () => useLeaguesStore((state) => state.archivedLeagues);
export const useLeaguesActions = () => ({
  addLeague: useLeaguesStore.getState().addLeague,
  updateLeague: useLeaguesStore.getState().updateLeague,
  deleteLeague: useLeaguesStore.getState().deleteLeague,
  archiveLeague: useLeaguesStore.getState().archiveLeague,
  restoreLeague: useLeaguesStore.getState().restoreLeague,
  setLeagues: useLeaguesStore.getState().setLeagues,
  setArchivedLeagues: useLeaguesStore.getState().setArchivedLeagues,
  loadLeagues: useLeaguesStore.getState().loadLeagues,
  loadArchivedLeagues: useLeaguesStore.getState().loadArchivedLeagues,
});

