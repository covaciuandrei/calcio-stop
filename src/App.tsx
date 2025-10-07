import React, { useState } from 'react';
import { NavLink, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import BadgesPage from './components/badges/BadgesPage';
import Dashboard from './components/Dashboard';
import KitTypesPage from './components/kittypes/KitTypesPage';
import NamesetsPage from './components/namesets/NamesetsPage';
import ProductsPage from './components/products/ProductsPage';
import SalesPage from './components/sales/SalesPage';
import SettingsPopup from './components/shared/SettingsPopup';
import TeamsPage from './components/teams/TeamsPage';
import { useAppBarOrder } from './stores';

// Navigation items configuration
const NAVIGATION_ITEMS = {
  dashboard: { label: 'Dashboard', path: '/', end: true },
  products: { label: 'Products', path: '/products', end: false },
  sales: { label: 'Sales', path: '/sales', end: false },
  namesets: { label: 'Namesets', path: '/namesets', end: false },
  teams: { label: 'Teams', path: '/teams', end: false },
  badges: { label: 'Badges', path: '/badges', end: false },
  kittypes: { label: 'Kit Types', path: '/kittypes', end: false },
};

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const appBarOrder = useAppBarOrder();

  const openSettings = () => {
    setIsSettingsOpen(true);
  };
  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <Router>
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
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/namesets" element={<NamesetsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/badges" element={<BadgesPage />} />
          <Route path="/kittypes" element={<KitTypesPage />} />
        </Routes>

        <SettingsPopup isOpen={isSettingsOpen} onClose={closeSettings} />
      </div>
    </Router>
  );
};

export default App;
