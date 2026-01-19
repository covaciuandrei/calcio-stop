import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  clearAllData: () => void;
  initializeAuth: () => void;
}

// Selectors (can be used outside the store)
export const authSelectors = {
  isAdmin: (state: AuthState) => state.user?.role === 'admin',
  isManager: (state: AuthState) => state.user?.role === 'manager',
  userName: (state: AuthState) => state.user?.name || '',
  userEmail: (state: AuthState) => state.user?.email || '',
};

// Store
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });

          try {
            // Real Supabase authentication
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) {
              throw new Error(error.message);
            }

            if (data.user) {
              const user = {
                id: data.user.id,
                email: data.user.email || email,
                name: data.user.user_metadata?.name || email.split('@')[0],
                role: 'admin' as const, // You can implement role-based logic here
              };

              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            }
          } catch (error) {
            console.error('Login error:', error);
            set({
              error: error instanceof Error ? error.message : 'Login failed',
              isLoading: false,
            });
          }
        },

        register: async (email: string, password: string, name?: string) => {
          set({ isLoading: true, error: null });

          try {
            // Real Supabase registration
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  name: name || email.split('@')[0],
                },
              },
            });

            if (error) {
              throw new Error(error.message);
            }

            if (data.user) {
              // Check if email confirmation is required
              if (data.user.email_confirmed_at === null) {
                set({
                  error: 'Please check your email and click the confirmation link to complete registration.',
                  isLoading: false,
                });
                return;
              }

              // Auto-login after successful registration
              const user = {
                id: data.user.id,
                email: data.user.email || email,
                name: name || email.split('@')[0],
                role: 'admin' as const,
              };

              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            }
          } catch (error) {
            console.error('Registration error:', error);
            set({
              error: error instanceof Error ? error.message : 'Registration failed',
              isLoading: false,
            });
          }
        },

        logout: async () => {
          try {
            // Sign out from Supabase
            const { error } = await supabase.auth.signOut();

            if (error) {
              console.error('Supabase signOut error:', error);
            }
          } catch (error) {
            console.error('Error signing out:', error);
          }

          // Clear only auth-related localStorage (not all settings)
          localStorage.removeItem('auth-persist');

          // Then clear the state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        },

        setUser: (user: User) => {
          set({
            user,
            isAuthenticated: true,
          });
        },

        clearError: () => {
          set({ error: null });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        clearAllData: () => {
          // Clear all localStorage data
          localStorage.clear();
          // Reset state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        },

        initializeAuth: async () => {
          try {
            // Set loading without clearing user state to avoid auth flash
            set({ isLoading: true, error: null });

            // Check if user is already authenticated with Supabase
            const {
              data: { user },
            } = await supabase.auth.getUser();

            if (user) {
              const userData = {
                id: user.id,
                email: user.email || '',
                name: user.user_metadata?.name || user.email?.split('@')[0] || '',
                role: 'admin' as const,
              };

              set({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              // No authenticated user, ensure clean state
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
            }
          } catch (error) {
            console.error('Error initializing auth:', error);
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        },
      }),
      {
        name: 'auth-persist',
        partialize: (state: AuthState) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// Typed selectors for easier usage
export const useAuth = () => useAuthStore();
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthStatus = () =>
  useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
  }));
