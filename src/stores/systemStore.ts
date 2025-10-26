import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as db from '../lib/db';

interface SystemState {
  // State
  registrationEnabled: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  setRegistrationEnabled: (enabled: boolean) => Promise<void>;
  clearError: () => void;
}

export const useSystemStore = create<SystemState>()(
  devtools(
    (set, get) => ({
      // Initial state
      registrationEnabled: false, // Changed to false to disable registration by default
      isLoading: false,
      error: null,

      // Actions
      loadSettings: async () => {
        set({ isLoading: true, error: null });

        try {
          const enabled = await db.isRegistrationEnabled();
          set({
            registrationEnabled: enabled,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load settings',
            isLoading: false,
          });
        }
      },

      setRegistrationEnabled: async (enabled: boolean) => {
        set({ isLoading: true, error: null });

        try {
          await db.setRegistrationEnabled(enabled);
          set({
            registrationEnabled: enabled,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update settings',
            isLoading: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'system-store',
    }
  )
);
