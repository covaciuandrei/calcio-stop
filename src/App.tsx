import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import AddProductForm from "./components/AddProductForm";
import ArchivedProductList from "./components/ArchivedProducts";
import EditProduct from "./components/EditProduct";
import ProductList from "./components/ProductList";
import SaleForm from "./components/SaleForm";
import SaleHistory from "./components/SaleHistory";
import { Product, Sale } from "./types/types";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [archivedProducts, setArchivedProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Load from localStorage
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

  return (
    <Router>
      <div className="app-container">
        <h1>Stock Manager</h1>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="card">
                  <AddProductForm
                    products={products}
                    setProducts={setProducts}
                  />
                </div>
                <div className="card">
                  <ProductList
                    products={products}
                    setProducts={setProducts}
                    setArchivedProducts={setArchivedProducts}
                  />
                </div>
                <div className="card">
                  <ArchivedProductList archivedProducts={archivedProducts} />
                </div>
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
            path="/edit/:id"
            element={
              <EditProduct products={products} setProducts={setProducts} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
