import React, { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import '../../App.css';
import { AuthPage } from './AuthPage';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication state from localStorage
    initializeAuth();
  }, [initializeAuth]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="loading-fallback">Loading...</div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show protected content if authenticated
  return <>{children}</>;
};
