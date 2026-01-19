import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as db from '../lib/db';
import { Badge, BadgeImage } from '../types';
import { getErrorMessage, isForeignKeyConstraintError } from '../utils/errorHandler';

interface BadgesState {
  // State
  badges: Badge[];
  archivedBadges: Badge[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addBadge: (badge: Omit<Badge, 'id' | 'createdAt'>) => Promise<void>;
  updateBadge: (id: string, updates: Partial<Badge>) => Promise<void>;
  deleteBadge: (id: string) => Promise<void>;
  archiveBadge: (id: string) => Promise<void>;
  restoreBadge: (id: string) => Promise<void>;
  setBadges: (badges: Badge[]) => void;
  setArchivedBadges: (badges: Badge[]) => void;
  loadBadges: () => Promise<void>;
  loadArchivedBadges: () => Promise<void>;
  clearError: () => void;
  // Image management actions
  updateBadgeImages: (badgeId: string, images: BadgeImage[]) => void;
  addBadgeImage: (badgeId: string, image: BadgeImage) => void;
  removeBadgeImage: (badgeId: string, imageId: string) => void;
  refreshBadge: (badgeId: string) => Promise<void>;
}

// Selectors
export const badgesSelectors = {
  getBadgeById: (state: BadgesState, id: string) => state.badges.find((b) => b.id === id),
  getBadgesByName: (state: BadgesState, name: string) =>
    state.badges.filter((b) => b.name.toLowerCase().includes(name.toLowerCase())),
  getBadgesBySeason: (state: BadgesState, season: string) => state.badges.filter((b) => b.season === season),
  getAvailableBadges: (state: BadgesState) => state.badges.filter((b) => b.quantity > 0),
  getSoldOutBadges: (state: BadgesState) => state.badges.filter((b) => b.quantity === 0),
  getTotalBadges: (state: BadgesState) => state.badges.length,
  getTotalArchivedBadges: (state: BadgesState) => state.archivedBadges.length,
};

// Store
export const useBadgesStore = create<BadgesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      badges: [],
      archivedBadges: [],
      isLoading: false,
      error: null,

      // Actions
      addBadge: async (badgeData: Omit<Badge, 'id' | 'createdAt'>) => {
        set({ isLoading: true, error: null });
        try {
          const newBadge = await db.createBadge({
            ...badgeData,
            createdAt: new Date().toISOString(),
          });
          set((state) => ({
            badges: [...state.badges, newBadge],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add badge',
            isLoading: false,
          });
        }
      },

      updateBadge: async (id: string, updates: Partial<Badge>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedBadge = await db.updateBadge(id, updates);
          set((state) => ({
            badges: state.badges.map((b) => (b.id === id ? updatedBadge : b)),
            archivedBadges: state.archivedBadges.map((b) => (b.id === id ? updatedBadge : b)),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update badge',
            isLoading: false,
          });
        }
      },

      deleteBadge: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await db.deleteBadge(id);
          set((state) => ({
            badges: state.badges.filter((b) => b.id !== id),
            archivedBadges: state.archivedBadges.filter((b) => b.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = getErrorMessage(error as Error, 'delete', 'badge');
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

      archiveBadge: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const archivedBadge = await db.archiveBadge(id);
          set((state) => ({
            badges: state.badges.filter((b) => b.id !== id),
            archivedBadges: [...state.archivedBadges, archivedBadge],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to archive badge',
            isLoading: false,
          });
        }
      },

      restoreBadge: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const restoredBadge = await db.restoreBadge(id);
          set((state) => ({
            archivedBadges: state.archivedBadges.filter((b) => b.id !== id),
            badges: [...state.badges, restoredBadge],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to restore badge',
            isLoading: false,
          });
        }
      },

      setBadges: (badges: Badge[]) => {
        set({ badges });
      },

      setArchivedBadges: (archivedBadges: Badge[]) => {
        set({ archivedBadges });
      },

      loadBadges: async () => {
        set({ isLoading: true, error: null });
        try {
          const badges = await db.getBadges();
          set({ badges, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load badges',
            isLoading: false,
          });
        }
      },

      loadArchivedBadges: async () => {
        set({ isLoading: true, error: null });
        try {
          const archivedBadges = await db.getArchivedBadges();
          set({ archivedBadges, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load archived badges',
            isLoading: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      // Image management actions
      updateBadgeImages: (badgeId: string, images: BadgeImage[]) => {
        set((state) => ({
          badges: state.badges.map((b) => (b.id === badgeId ? { ...b, images } : b)),
          archivedBadges: state.archivedBadges.map((b) => (b.id === badgeId ? { ...b, images } : b)),
        }));
      },

      addBadgeImage: (badgeId: string, image: BadgeImage) => {
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === badgeId ? { ...b, images: [...(b.images || []), image] } : b
          ),
          archivedBadges: state.archivedBadges.map((b) =>
            b.id === badgeId ? { ...b, images: [...(b.images || []), image] } : b
          ),
        }));
      },

      removeBadgeImage: (badgeId: string, imageId: string) => {
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === badgeId ? { ...b, images: (b.images || []).filter((img) => img.id !== imageId) } : b
          ),
          archivedBadges: state.archivedBadges.map((b) =>
            b.id === badgeId ? { ...b, images: (b.images || []).filter((img) => img.id !== imageId) } : b
          ),
        }));
      },

      refreshBadge: async (badgeId: string) => {
        try {
          // Reload all badges to get the latest data
          const badges = await db.getBadges();
          const archivedBadges = await db.getArchivedBadges();
          set({ badges, archivedBadges });
        } catch (error) {
          console.error('Failed to refresh badge:', error);
        }
      },
    }),
    {
      name: 'badges-store',
    }
  )
);

// Typed selectors for easier usage
export const useBadges = () => useBadgesStore();
export const useBadgesList = () => useBadgesStore((state) => state.badges);
export const useArchivedBadges = () => useBadgesStore((state) => state.archivedBadges);
export const useBadgesLoading = () => useBadgesStore((state) => state.isLoading);
export const useSoldOutBadges = () => useBadgesStore((state) => state.badges);
export const useBadgesActions = () => ({
  addBadge: useBadgesStore.getState().addBadge,
  updateBadge: useBadgesStore.getState().updateBadge,
  deleteBadge: useBadgesStore.getState().deleteBadge,
  archiveBadge: useBadgesStore.getState().archiveBadge,
  restoreBadge: useBadgesStore.getState().restoreBadge,
  setBadges: useBadgesStore.getState().setBadges,
  setArchivedBadges: useBadgesStore.getState().setArchivedBadges,
  loadBadges: useBadgesStore.getState().loadBadges,
  loadArchivedBadges: useBadgesStore.getState().loadArchivedBadges,
  // Image management actions
  updateBadgeImages: useBadgesStore.getState().updateBadgeImages,
  addBadgeImage: useBadgesStore.getState().addBadgeImage,
  removeBadgeImage: useBadgesStore.getState().removeBadgeImage,
  refreshBadge: useBadgesStore.getState().refreshBadge,
});
