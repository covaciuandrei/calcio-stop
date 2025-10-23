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
            console.log('Attempting Supabase login for:', email);

            // Real Supabase authentication
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            console.log('Supabase login response:', { data, error });

            if (error) {
              throw new Error(error.message);
            }

            if (data.user) {
              console.log('Login successful:', data.user);

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
            console.log('Attempting Supabase registration for:', email);

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

            console.log('Supabase registration response:', { data, error });

            if (error) {
              throw new Error(error.message);
            }

            if (data.user) {
              console.log('User created successfully:', data.user);

              // Check if email confirmation is required
              if (data.user.email_confirmed_at === null) {
                console.log('Email confirmation required');
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
            console.log('Starting logout process...');

            // Sign out from Supabase
            const { error } = await supabase.auth.signOut();

            if (error) {
              console.error('Supabase signOut error:', error);
            } else {
              console.log('Successfully signed out from Supabase');
            }
          } catch (error) {
            console.error('Error signing out:', error);
          }

          console.log('Clearing local state and localStorage...');

          // Clear localStorage FIRST to prevent persistence from restoring state
          localStorage.removeItem('auth-store');
          localStorage.clear(); // Clear all localStorage to be sure

          // Then clear the state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          console.log('Logout completed successfully');
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
            console.log('Initializing authentication...');

            // First, clear any stale local state
            set({
              user: null,
              isAuthenticated: false,
              isLoading: true,
              error: null,
            });

            // Check if user is already authenticated with Supabase
            const {
              data: { user },
            } = await supabase.auth.getUser();

            console.log('Supabase auth check result:', user ? 'User found' : 'No user');

            if (user) {
              const userData = {
                id: user.id,
                email: user.email || '',
                name: user.user_metadata?.name || user.email?.split('@')[0] || '',
                role: 'admin' as const,
              };

              console.log('Setting authenticated user:', userData);

              set({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              // No authenticated user, ensure clean state
              console.log('No authenticated user, clearing state');
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
        name: 'auth-store', // DevTools name
      }
    ),
    {
      name: 'auth-persist', // Persist name
      partialize: (state: AuthState) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
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
