import React, { useEffect, useState } from "react";
import {
  NavLink,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import AddProductForm from "./components/AddProductForm";
import ArchivedProducts from "./components/ArchivedProducts";
import Dashboard from "./components/Dashboard";
import EditProduct from "./components/EditProduct";
import NamesetSection from "./components/NamesetSection";
import ProductList from "./components/ProductList";
import SaleForm from "./components/SaleForm";
import SaleHistory from "./components/SaleHistory";
import { Nameset, Product, Sale } from "./types/types";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [archivedProducts, setArchivedProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [namesets, setNamesets] = useState<Nameset[]>([]);

  // Load from localStorage
  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
    setArchivedProducts(
      JSON.parse(localStorage.getItem("archivedProducts") || "[]")
    );
    setSales(JSON.parse(localStorage.getItem("sales") || "[]"));
    setNamesets(JSON.parse(localStorage.getItem("namesets") || "[]"));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("archivedProducts", JSON.stringify(archivedProducts));
  }, [archivedProducts]);

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("namesets", JSON.stringify(namesets));
  }, [namesets]);

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
              />
            }
          />

          {/* Products */}
          <Route
            path="/products"
            element={
              <ProductList
                products={products}
                setProducts={setProducts}
                archivedProducts={archivedProducts}
                setArchivedProducts={setArchivedProducts}
              />
            }
          />
          <Route
            path="/add"
            element={
              <AddProductForm products={products} setProducts={setProducts} />
            }
          />
          <Route
            path="/edit/:id"
            element={
              <EditProduct products={products} setProducts={setProducts} />
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
                />
                <SaleHistory
                  sales={sales}
                  products={products}
                  archivedProducts={archivedProducts}
                  setSales={setSales}
                />
              </>
            }
          />

          {/* Archived */}
          <Route
            path="/archived"
            element={<ArchivedProducts archivedProducts={archivedProducts} />}
          />

          {/* Namesets */}
          <Route
            path="/namesets"
            element={
              <NamesetSection namesets={namesets} setNamesets={setNamesets} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
