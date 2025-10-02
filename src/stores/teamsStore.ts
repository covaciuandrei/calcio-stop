import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Team } from '../types';

interface TeamsState {
  // State
  teams: Team[];
  archivedTeams: Team[];

  // Actions
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  archiveTeam: (id: string) => void;
  restoreTeam: (id: string) => void;
  setTeams: (teams: Team[]) => void;
  setArchivedTeams: (teams: Team[]) => void;
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
    persist(
      (set, get) => ({
        // Initial state
        teams: [],
        archivedTeams: [],

        // Actions
        addTeam: (team: Team) => {
          set((state) => ({
            teams: [...state.teams, team],
          }));
        },

        updateTeam: (id: string, updates: Partial<Team>) => {
          set((state) => ({
            teams: state.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
          }));
        },

        deleteTeam: (id: string) => {
          set((state) => ({
            teams: state.teams.filter((t) => t.id !== id),
          }));
        },

        archiveTeam: (id: string) => {
          const team = get().teams.find((t) => t.id === id);
          if (team) {
            set((state) => ({
              teams: state.teams.filter((t) => t.id !== id),
              archivedTeams: [...state.archivedTeams, team],
            }));
          }
        },

        restoreTeam: (id: string) => {
          const team = get().archivedTeams.find((t) => t.id === id);
          if (team) {
            set((state) => ({
              archivedTeams: state.archivedTeams.filter((t) => t.id !== id),
              teams: [...state.teams, team],
            }));
          }
        },

        setTeams: (teams: Team[]) => {
          set({ teams });
        },

        setArchivedTeams: (archivedTeams: Team[]) => {
          set({ archivedTeams });
        },
      }),
      {
        name: 'teams-store',
        partialize: (state) => ({
          teams: state.teams,
          archivedTeams: state.archivedTeams,
        }),
      }
    ),
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
});
