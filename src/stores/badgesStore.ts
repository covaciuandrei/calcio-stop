import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Badge } from '../types';

interface BadgesState {
  // State
  badges: Badge[];
  archivedBadges: Badge[];

  // Actions
  addBadge: (badge: Badge) => void;
  updateBadge: (id: string, updates: Partial<Badge>) => void;
  deleteBadge: (id: string) => void;
  archiveBadge: (id: string) => void;
  restoreBadge: (id: string) => void;
  setBadges: (badges: Badge[]) => void;
  setArchivedBadges: (badges: Badge[]) => void;
}

// Selectors
export const badgesSelectors = {
  getBadgeById: (state: BadgesState, id: string) => state.badges.find((b) => b.id === id),
  getBadgesByName: (state: BadgesState, name: string) =>
    state.badges.filter((b) => b.name.toLowerCase().includes(name.toLowerCase())),
  getBadgesBySeason: (state: BadgesState, season: string) => state.badges.filter((b) => b.season === season),
  getAvailableBadges: (state: BadgesState) => state.badges.filter((b) => b.quantity > 0),
  getTotalBadges: (state: BadgesState) => state.badges.length,
  getTotalArchivedBadges: (state: BadgesState) => state.archivedBadges.length,
};

// Store
export const useBadgesStore = create<BadgesState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        badges: [],
        archivedBadges: [],

        // Actions
        addBadge: (badge: Badge) => {
          set((state) => ({
            badges: [...state.badges, badge],
          }));
        },

        updateBadge: (id: string, updates: Partial<Badge>) => {
          set((state) => ({
            badges: state.badges.map((b) => (b.id === id ? { ...b, ...updates } : b)),
          }));
        },

        deleteBadge: (id: string) => {
          set((state) => ({
            badges: state.badges.filter((b) => b.id !== id),
          }));
        },

        archiveBadge: (id: string) => {
          const badge = get().badges.find((b) => b.id === id);
          if (badge) {
            set((state) => ({
              badges: state.badges.filter((b) => b.id !== id),
              archivedBadges: [...state.archivedBadges, badge],
            }));
          }
        },

        restoreBadge: (id: string) => {
          const badge = get().archivedBadges.find((b) => b.id === id);
          if (badge) {
            set((state) => ({
              archivedBadges: state.archivedBadges.filter((b) => b.id !== id),
              badges: [...state.badges, badge],
            }));
          }
        },

        setBadges: (badges: Badge[]) => {
          set({ badges });
        },

        setArchivedBadges: (archivedBadges: Badge[]) => {
          set({ archivedBadges });
        },
      }),
      {
        name: 'badges-store',
        partialize: (state) => ({
          badges: state.badges,
          archivedBadges: state.archivedBadges,
        }),
      }
    ),
    {
      name: 'badges-store',
    }
  )
);

// Typed selectors for easier usage
export const useBadges = () => useBadgesStore();
export const useBadgesList = () => useBadgesStore((state) => state.badges);
export const useArchivedBadges = () => useBadgesStore((state) => state.archivedBadges);
export const useBadgesActions = () => ({
  addBadge: useBadgesStore.getState().addBadge,
  updateBadge: useBadgesStore.getState().updateBadge,
  deleteBadge: useBadgesStore.getState().deleteBadge,
  archiveBadge: useBadgesStore.getState().archiveBadge,
  restoreBadge: useBadgesStore.getState().restoreBadge,
  setBadges: useBadgesStore.getState().setBadges,
  setArchivedBadges: useBadgesStore.getState().setArchivedBadges,
});
