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

interface UIState {
  // State
  theme: Theme;
  sidebarCollapsed: boolean;
  modal: Modal;
  notifications: Notification[];
  isLoading: boolean;
  loadingMessage: string;

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
