import React from 'react';
import { NavLink, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import BadgesPage from './components/badges/BadgesPage';
import Dashboard from './components/Dashboard';
import NamesetsPage from './components/namesets/NamesetsPage';
import ProductsPage from './components/products/ProductsPage';
import SalesPage from './components/sales/SalesPage';
import TeamsPage from './components/teams/TeamsPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/sales">Sales</NavLink>
          <NavLink to="/namesets">Namesets</NavLink>
          <NavLink to="/teams">Teams</NavLink>
          <NavLink to="/badges">Badges</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/namesets" element={<NamesetsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/badges" element={<BadgesPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
