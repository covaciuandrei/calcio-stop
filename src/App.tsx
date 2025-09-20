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
import ProductList from "./components/ProductList";
import SaleForm from "./components/SaleForm";
import SaleHistory from "./components/SaleHistory";
import { Product, Sale } from "./types/types";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [archivedProducts, setArchivedProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const savedArchived = JSON.parse(
      localStorage.getItem("archivedProducts") || "[]"
    );
    const savedSales = JSON.parse(localStorage.getItem("sales") || "[]");
    setProducts(savedProducts);
    setArchivedProducts(savedArchived);
    setSales(savedSales);
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem("archivedProducts", JSON.stringify(archivedProducts));
  }, [archivedProducts]);
  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  return (
    <Router>
      <div className="app-container">
        {/* ✅ Styled Navbar */}
        <nav className="navbar">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/add">Add Product</NavLink>
          <NavLink to="/sales">Sales</NavLink>
          <NavLink to="/archived">Archived</NavLink>
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
              />
            }
          />

          <Route
            path="/products"
            element={
              <div className="card">
                <ProductList
                  products={products}
                  setProducts={setProducts}
                  archivedProducts={archivedProducts}
                  setArchivedProducts={setArchivedProducts}
                />
              </div>
            }
          />

          <Route
            path="/add"
            element={
              <div className="card">
                <AddProductForm products={products} setProducts={setProducts} />
              </div>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <EditProduct products={products} setProducts={setProducts} />
            }
          />

          <Route
            path="/sales"
            element={
              <>
                <div className="card">
                  <SaleForm
                    products={products}
                    setProducts={setProducts}
                    sales={sales}
                    setSales={setSales}
                  />
                </div>
                <div className="card">
                  <SaleHistory
                    sales={sales}
                    products={products}
                    archivedProducts={archivedProducts}
                    setSales={setSales}
                  />
                </div>
              </>
            }
          />

          <Route
            path="/archived"
            element={
              <div className="card">
                <ArchivedProducts archivedProducts={archivedProducts} />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
