import React, { useEffect, useState } from 'react';
import { NavLink, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AddProductForm from './components/AddProductForm';
import ArchivedProducts from './components/ArchivedProducts';
import Dashboard from './components/Dashboard';
import NamesetsPage from './components/NamesetsPage';
import ProductList from './components/ProductList';
import SaleForm from './components/SaleForm';
import SaleHistory from './components/SaleHistory';
import TeamsPage from './components/TeamsPage';
import { Nameset, Product, Sale, Team } from './types/types';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [archivedProducts, setArchivedProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [namesets, setNamesets] = useState<Nameset[]>([]);
  const [archivedNamesets, setArchivedNamesets] = useState<Nameset[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [archivedTeams, setArchivedTeams] = useState<Team[]>([]);

  // Load from localStorage
  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem('products') || '[]'));
    setArchivedProducts(JSON.parse(localStorage.getItem('archivedProducts') || '[]'));
    setSales(JSON.parse(localStorage.getItem('sales') || '[]'));
    setNamesets(JSON.parse(localStorage.getItem('namesets') || '[]'));
    setArchivedNamesets(JSON.parse(localStorage.getItem('archivedNamesets') || '[]'));
    setTeams(JSON.parse(localStorage.getItem('teams') || '[]'));
    setArchivedTeams(JSON.parse(localStorage.getItem('archivedTeams') || '[]'));
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

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/add">Add Product</NavLink>
          <NavLink to="/sales">Sales</NavLink>
          <NavLink to="/archived">Archived</NavLink>
          <NavLink to="/namesets">Namesets</NavLink>
          <NavLink to="/teams">Teams</NavLink>
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
              />
            }
          />

          {/* Products */}
          <Route
            path="/products"
            element={
              <div className="card">
                {' '}
                <ProductList
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
              </div>
            }
          />
          <Route
            path="/add"
            element={
              <AddProductForm
                products={products}
                setProducts={setProducts}
                namesets={namesets}
                setNamesets={setNamesets}
                archivedNamesets={archivedNamesets}
                setArchivedNamesets={setArchivedNamesets}
                teams={teams}
                setTeams={setTeams}
                archivedTeams={archivedTeams}
                setArchivedTeams={setArchivedTeams}
              />
            }
          />

          {/* Sales */}
          <Route
            path="/sales"
            element={
              <>
                <SaleForm
                  products={products}
                  setProducts={setProducts}
                  sales={sales}
                  setSales={setSales}
                  namesets={namesets}
                  archivedNamesets={archivedNamesets}
                  teams={teams}
                  archivedTeams={archivedTeams}
                />
                <SaleHistory
                  sales={sales}
                  products={products}
                  archivedProducts={archivedProducts}
                  setSales={setSales}
                  namesets={namesets}
                  archivedNamesets={archivedNamesets}
                  teams={teams}
                  archivedTeams={archivedTeams}
                />
              </>
            }
          />

          {/* Archived */}
          <Route
            path="/archived"
            element={
              <ArchivedProducts
                archivedProducts={archivedProducts}
                namesets={namesets}
                archivedNamesets={archivedNamesets}
                teams={teams}
                archivedTeams={archivedTeams}
              />
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
