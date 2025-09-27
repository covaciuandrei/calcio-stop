import React, { useEffect, useState } from 'react';
import { NavLink, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import BadgesPage from './components/BadgesPage';
import Dashboard from './components/Dashboard';
import NamesetsPage from './components/NamesetsPage';
import ProductsPage from './components/ProductsPage';
import SalesPage from './components/SalesPage';
import TeamsPage from './components/TeamsPage';
import { Badge, Nameset, Product, Sale, Team } from './types/types';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [archivedProducts, setArchivedProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [namesets, setNamesets] = useState<Nameset[]>([]);
  const [archivedNamesets, setArchivedNamesets] = useState<Nameset[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [archivedTeams, setArchivedTeams] = useState<Team[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [archivedBadges, setArchivedBadges] = useState<Badge[]>([]);

  // Load from localStorage
  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem('products') || '[]'));
    setArchivedProducts(JSON.parse(localStorage.getItem('archivedProducts') || '[]'));
    setSales(JSON.parse(localStorage.getItem('sales') || '[]'));
    setNamesets(JSON.parse(localStorage.getItem('namesets') || '[]'));
    setArchivedNamesets(JSON.parse(localStorage.getItem('archivedNamesets') || '[]'));
    setTeams(JSON.parse(localStorage.getItem('teams') || '[]'));
    setArchivedTeams(JSON.parse(localStorage.getItem('archivedTeams') || '[]'));
    setBadges(JSON.parse(localStorage.getItem('badges') || '[]'));
    setArchivedBadges(JSON.parse(localStorage.getItem('archivedBadges') || '[]'));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('archivedProducts', JSON.stringify(archivedProducts));
  }, [archivedProducts]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('namesets', JSON.stringify(namesets));
  }, [namesets]);

  useEffect(() => {
    localStorage.setItem('archivedNamesets', JSON.stringify(archivedNamesets));
  }, [archivedNamesets]);

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('archivedTeams', JSON.stringify(archivedTeams));
  }, [archivedTeams]);

  useEffect(() => {
    localStorage.setItem('badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('archivedBadges', JSON.stringify(archivedBadges));
  }, [archivedBadges]);

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
          <Route
            path="/"
            element={
              <Dashboard
                products={products}
                setProducts={setProducts}
                archivedProducts={archivedProducts}
                setArchivedProducts={setArchivedProducts}
                sales={sales}
                setSales={setSales}
                namesets={namesets}
                setNamesets={setNamesets}
                archivedNamesets={archivedNamesets}
                setArchivedNamesets={setArchivedNamesets}
                teams={teams}
                setTeams={setTeams}
                archivedTeams={archivedTeams}
                setArchivedTeams={setArchivedTeams}
                badges={badges}
                setBadges={setBadges}
                archivedBadges={archivedBadges}
                setArchivedBadges={setArchivedBadges}
              />
            }
          />

          {/* Products */}
          <Route
            path="/products"
            element={
              <>
                <ProductsPage
                  products={products}
                  setProducts={setProducts}
                  archivedProducts={archivedProducts}
                  setArchivedProducts={setArchivedProducts}
                  namesets={namesets}
                  setNamesets={setNamesets}
                  archivedNamesets={archivedNamesets}
                  setArchivedNamesets={setArchivedNamesets}
                  teams={teams}
                  setTeams={setTeams}
                  archivedTeams={archivedTeams}
                  setArchivedTeams={setArchivedTeams}
                />
              </>
            }
          />

          {/* Sales */}
          <Route
            path="/sales"
            element={
              <>
                <SalesPage
                  products={products}
                  setProducts={setProducts}
                  sales={sales}
                  setSales={setSales}
                  namesets={namesets}
                  archivedNamesets={archivedNamesets}
                  teams={teams}
                  archivedTeams={archivedTeams}
                />
              </>
            }
          />

          {/* Namesets */}
          <Route
            path="/namesets"
            element={
              <NamesetsPage
                namesets={namesets}
                setNamesets={setNamesets}
                archivedNamesets={archivedNamesets}
                setArchivedNamesets={setArchivedNamesets}
              />
            }
          />

          {/* Teams */}
          <Route
            path="/teams"
            element={
              <TeamsPage
                teams={teams}
                setTeams={setTeams}
                archivedTeams={archivedTeams}
                setArchivedTeams={setArchivedTeams}
              />
            }
          />

          {/* Badges */}
          <Route
            path="/badges"
            element={
              <BadgesPage
                badges={badges}
                setBadges={setBadges}
                archivedBadges={archivedBadges}
                setArchivedBadges={setArchivedBadges}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
