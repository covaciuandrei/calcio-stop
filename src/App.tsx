import React, { useState } from 'react';
import { NavLink, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import StatsDashboard from './components/admin/StatsDashboard';
import { SystemSettings } from './components/admin/SystemSettings';
import { AuthGuard } from './components/auth/AuthGuard';
import { UserMenu } from './components/auth/UserMenu';
import BadgeDetailPage from './components/badges/BadgeDetailPage';
import BadgesPage from './components/badges/BadgesPage';
import Dashboard from './components/Dashboard';
import KitTypesPage from './components/kittypes/KitTypesPage';
import NamesetsPage from './components/namesets/NamesetsPage';
import OrdersPage from './components/orders/OrdersPage';
import ProductDetailPage from './components/products/ProductDetailPage';
import ProductsPage from './components/products/ProductsPage';
import PublicBadgesPage from './components/public/PublicBadgesPage';
import PublicDashboard from './components/public/PublicDashboard';
import { PublicLayout } from './components/public/PublicLayout';
import PublicProductsPage from './components/public/PublicProductsPage';
import ReservationsPage from './components/reservations/ReservationsPage';
import ReturnsPage from './components/returns/ReturnsPage';
import SalesPage from './components/sales/SalesPage';
import SettingsPopup from './components/shared/SettingsPopup';
import TeamsPage from './components/teams/TeamsPage';
import { useAppBarOrder, useAuth } from './stores';

// Navigation items configuration
const NAVIGATION_ITEMS = {
  dashboard: { label: 'Dashboard', path: '/', end: true },
  products: { label: 'Products', path: '/products', end: false },
  sales: { label: 'Sales', path: '/sales', end: false },
  returns: { label: 'Returns', path: '/returns', end: false },
  namesets: { label: 'Namesets', path: '/namesets', end: false },
  teams: { label: 'Teams', path: '/teams', end: false },
  badges: { label: 'Badges', path: '/badges', end: false },
  kittypes: { label: 'Kit Types', path: '/kittypes', end: false },
  settings: { label: 'System Settings', path: '/settings', end: false },
};

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const appBarOrder = useAppBarOrder();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'admin' && isAuthenticated;

  const openSettings = () => {
    setIsSettingsOpen(true);
  };
  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <Router>
      <Routes>
        {/* Public routes - no authentication required (only products and badges) */}
        <Route
          path="/public"
          element={
            <PublicLayout>
              <PublicDashboard />
            </PublicLayout>
          }
        />
        <Route
          path="/public/products"
          element={
            <PublicLayout>
              <PublicProductsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/public/products/:id"
          element={
            <PublicLayout>
              <ProductDetailPage />
            </PublicLayout>
          }
        />
        <Route
          path="/public/badges"
          element={
            <PublicLayout>
              <PublicBadgesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/public/badges/:id"
          element={
            <PublicLayout>
              <BadgeDetailPage />
            </PublicLayout>
          }
        />

        {/* Protected routes - authentication required */}
        <Route
          path="/*"
          element={
            <AuthGuard>
              <div className="app-container">
                <nav className="navbar">
                  {appBarOrder.map((itemId) => {
                    const item = NAVIGATION_ITEMS[itemId as keyof typeof NAVIGATION_ITEMS];
                    if (!item) return null;

                    return (
                      <NavLink key={itemId} to={item.path} end={item.end}>
                        {item.label}
                      </NavLink>
                    );
                  })}
                  <div className="navbar-actions">
                    <button
                      className="settings-button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openSettings();
                      }}
                      title="Customize Layout"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    </button>
                    <button
                      className="settings-button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = '/orders';
                      }}
                      title="Orders"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </button>
                    <button
                      className="settings-button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = '/stats';
                      }}
                      title="Statistics"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 3v18h18" />
                        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                      </svg>
                    </button>
                    <UserMenu />
                  </div>
                </nav>

                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/sales" element={<SalesPage />} />
                  <Route path="/returns" element={<ReturnsPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/namesets" element={<NamesetsPage />} />
                  <Route path="/teams" element={<TeamsPage />} />
                  <Route path="/badges" element={<BadgesPage />} />
                  <Route path="/badges/:id" element={<BadgeDetailPage />} />
                  <Route path="/kittypes" element={<KitTypesPage />} />
                  {isAdmin && <Route path="/reservations" element={<ReservationsPage />} />}
                  <Route path="/stats" element={<StatsDashboard />} />
                  <Route path="/settings" element={<SystemSettings />} />
                </Routes>

                <SettingsPopup isOpen={isSettingsOpen} onClose={closeSettings} />
              </div>
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
