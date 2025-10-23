import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as db from '../lib/db';
import { Team } from '../types';

interface TeamsState {
  // State
  teams: Team[];
  archivedTeams: Team[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => Promise<void>;
  updateTeam: (id: string, updates: Partial<Team>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  archiveTeam: (id: string) => Promise<void>;
  restoreTeam: (id: string) => Promise<void>;
  setTeams: (teams: Team[]) => void;
  setArchivedTeams: (teams: Team[]) => void;
  loadTeams: () => Promise<void>;
  loadArchivedTeams: () => Promise<void>;
}

// Selectors
export const teamsSelectors = {
  getTeamById: (state: TeamsState, id: string) => state.teams.find((t) => t.id === id),
  getTeamsByName: (state: TeamsState, name: string) =>
    state.teams.filter((t) => t.name.toLowerCase().includes(name.toLowerCase())),
  getTotalTeams: (state: TeamsState) => state.teams.length,
  getTotalArchivedTeams: (state: TeamsState) => state.archivedTeams.length,
};

// Store
export const useTeamsStore = create<TeamsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      teams: [],
      archivedTeams: [],
      isLoading: false,
      error: null,

      // Actions
      addTeam: async (teamData: Omit<Team, 'id' | 'createdAt'>) => {
        set({ isLoading: true, error: null });
        try {
          const newTeam = await db.createTeam({
            ...teamData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          });
          set((state) => ({
            teams: [...state.teams, newTeam],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add team',
            isLoading: false,
          });
        }
      },

      updateTeam: async (id: string, updates: Partial<Team>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedTeam = await db.updateTeam(id, updates);
          set((state) => ({
            teams: state.teams.map((t) => (t.id === id ? updatedTeam : t)),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update team',
            isLoading: false,
          });
        }
      },

      deleteTeam: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await db.deleteTeam(id);
          set((state) => ({
            teams: state.teams.filter((t) => t.id !== id),
            archivedTeams: state.archivedTeams.filter((t) => t.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete team',
            isLoading: false,
          });
        }
      },

      archiveTeam: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const archivedTeam = await db.archiveTeam(id);
          set((state) => ({
            teams: state.teams.filter((t) => t.id !== id),
            archivedTeams: [...state.archivedTeams, archivedTeam],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to archive team',
            isLoading: false,
          });
        }
      },

      restoreTeam: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const restoredTeam = await db.restoreTeam(id);
          set((state) => ({
            archivedTeams: state.archivedTeams.filter((t) => t.id !== id),
            teams: [...state.teams, restoredTeam],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to restore team',
            isLoading: false,
          });
        }
      },

      setTeams: (teams: Team[]) => {
        set({ teams });
      },

      setArchivedTeams: (archivedTeams: Team[]) => {
        set({ archivedTeams });
      },

      loadTeams: async () => {
        set({ isLoading: true, error: null });
        try {
          const teams = await db.getTeams();
          set({ teams, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load teams',
            isLoading: false,
          });
        }
      },

      loadArchivedTeams: async () => {
        set({ isLoading: true, error: null });
        try {
          const archivedTeams = await db.getArchivedTeams();
          set({ archivedTeams, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load archived teams',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'teams-store',
    }
  )
);

// Typed selectors for easier usage
export const useTeams = () => useTeamsStore();
export const useTeamsList = () => useTeamsStore((state) => state.teams);
export const useArchivedTeams = () => useTeamsStore((state) => state.archivedTeams);
export const useTeamsActions = () => ({
  addTeam: useTeamsStore.getState().addTeam,
  updateTeam: useTeamsStore.getState().updateTeam,
  deleteTeam: useTeamsStore.getState().deleteTeam,
  archiveTeam: useTeamsStore.getState().archiveTeam,
  restoreTeam: useTeamsStore.getState().restoreTeam,
  setTeams: useTeamsStore.getState().setTeams,
  setArchivedTeams: useTeamsStore.getState().setArchivedTeams,
  loadTeams: useTeamsStore.getState().loadTeams,
  loadArchivedTeams: useTeamsStore.getState().loadArchivedTeams,
});
