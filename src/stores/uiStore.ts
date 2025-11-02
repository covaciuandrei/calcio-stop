import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types
interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
}

interface Modal {
  isOpen: boolean;
  type: string | null;
  data?: any;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface SearchState {
  products: string;
  sales: string;
  namesets: string;
  teams: string;
  badges: string;
  kitTypes: string;
  leagues: string;
  archivedProducts: string;
  archivedNamesets: string;
  archivedTeams: string;
  archivedBadges: string;
  archivedKitTypes: string;
  archivedLeagues: string;
}

interface UIState {
  // State
  theme: Theme;
  sidebarCollapsed: boolean;
  modal: Modal;
  notifications: Notification[];
  isLoading: boolean;
  loadingMessage: string;
  searchTerms: SearchState;

  // Actions
  setTheme: (theme: Partial<Theme>) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (loading: boolean, message?: string) => void;
  setSearchTerm: (category: keyof SearchState, term: string) => void;
  clearSearchTerm: (category: keyof SearchState) => void;
  clearAllSearchTerms: () => void;
}

// Selectors
export const uiSelectors = {
  isDarkMode: (state: UIState) => state.theme.mode === 'dark',
  hasNotifications: (state: UIState) => state.notifications.length > 0,
  isModalOpen: (state: UIState) => state.modal.isOpen,
  getModalType: (state: UIState) => state.modal.type,
};

// Store
export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Initial state
      theme: {
        mode: 'light',
        primaryColor: '#007bff',
        fontSize: 'medium',
      },
      sidebarCollapsed: false,
      modal: {
        isOpen: false,
        type: null,
        data: null,
      },
      notifications: [],
      isLoading: false,
      loadingMessage: '',
      searchTerms: {
        products: '',
        sales: '',
        namesets: '',
        teams: '',
        badges: '',
        kitTypes: '',
        leagues: '',
        archivedProducts: '',
        archivedNamesets: '',
        archivedTeams: '',
        archivedBadges: '',
        archivedLeagues: '',
        archivedKitTypes: '',
      },

      // Actions
      setTheme: (themeUpdate: Partial<Theme>) => {
        set((state) => ({
          theme: { ...state.theme, ...themeUpdate },
        }));
      },

      toggleSidebar: () => {
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        }));
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      openModal: (type: string, data?: any) => {
        set({
          modal: {
            isOpen: true,
            type,
            data,
          },
        });
      },

      closeModal: () => {
        set({
          modal: {
            isOpen: false,
            type: null,
            data: null,
          },
        });
      },

      addNotification: (notification: Omit<Notification, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification: Notification = {
          ...notification,
          id,
        };

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-remove notification after duration
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration || 5000);
        }
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      setLoading: (loading: boolean, message: string = '') => {
        set({
          isLoading: loading,
          loadingMessage: message,
        });
      },

      setSearchTerm: (category: keyof SearchState, term: string) => {
        set((state) => ({
          searchTerms: {
            ...state.searchTerms,
            [category]: term,
          },
        }));
      },

      clearSearchTerm: (category: keyof SearchState) => {
        set((state) => ({
          searchTerms: {
            ...state.searchTerms,
            [category]: '',
          },
        }));
      },

      clearAllSearchTerms: () => {
        set((state) => ({
          searchTerms: {
            products: '',
            sales: '',
            namesets: '',
            teams: '',
            badges: '',
            kitTypes: '',
            leagues: '',
            archivedProducts: '',
            archivedNamesets: '',
            archivedTeams: '',
            archivedBadges: '',
            archivedKitTypes: '',
            archivedLeagues: '',
          },
        }));
      },
    }),
    {
      name: 'ui-store',
    }
  )
);

// Typed selectors for easier usage
export const useUI = () => useUIStore();
export const useTheme = () => useUIStore((state) => state.theme);
export const useModal = () => useUIStore((state) => state.modal);
export const useNotifications = () => useUIStore((state) => state.notifications);
export const useSidebar = () =>
  useUIStore((state) => ({
    collapsed: state.sidebarCollapsed,
    toggle: state.toggleSidebar,
    setCollapsed: state.setSidebarCollapsed,
  }));

// Search selectors
export const useSearchTerms = () => useUIStore((state) => state.searchTerms);
export const useSearchActions = () => ({
  setSearchTerm: useUIStore.getState().setSearchTerm,
  clearSearchTerm: useUIStore.getState().clearSearchTerm,
  clearAllSearchTerms: useUIStore.getState().clearAllSearchTerms,
});

// Individual search term selectors
export const useProductsSearch = () => useUIStore((state) => state.searchTerms.products);
export const useSalesSearch = () => useUIStore((state) => state.searchTerms.sales);
export const useNamesetsSearch = () => useUIStore((state) => state.searchTerms.namesets);
export const useTeamsSearch = () => useUIStore((state) => state.searchTerms.teams);
export const useBadgesSearch = () => useUIStore((state) => state.searchTerms.badges);
export const useKitTypesSearch = () => useUIStore((state) => state.searchTerms.kitTypes);
export const useLeaguesSearch = () => useUIStore((state) => state.searchTerms.leagues);
export const useArchivedProductsSearch = () => useUIStore((state) => state.searchTerms.archivedProducts);
export const useArchivedNamesetsSearch = () => useUIStore((state) => state.searchTerms.archivedNamesets);
export const useArchivedTeamsSearch = () => useUIStore((state) => state.searchTerms.archivedTeams);
export const useArchivedBadgesSearch = () => useUIStore((state) => state.searchTerms.archivedBadges);
export const useArchivedKitTypesSearch = () => useUIStore((state) => state.searchTerms.archivedKitTypes);
export const useArchivedLeaguesSearch = () => useUIStore((state) => state.searchTerms.archivedLeagues);
