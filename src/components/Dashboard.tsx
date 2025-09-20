import React from "react";
import { Product, Sale } from "../types/types";
import AddProductForm from "./AddProductForm";
import ArchivedProducts from "./ArchivedProducts";
import ProductList from "./ProductList";
import SaleForm from "./SaleForm";
import SaleHistory from "./SaleHistory";

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  archivedProducts: Product[];
  setArchivedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
}

const Dashboard: React.FC<Props> = ({
  products,
  setProducts,
  archivedProducts,
  setArchivedProducts,
  sales,
  setSales,
}) => {
  return (
    <div>
      <h2>Dashboard Overview</h2>

      {/* Add Product */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Add Product</h3>
        <AddProductForm products={products} setProducts={setProducts} />
      </div>

      {/* Record Sale */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Record Sale</h3>
        <SaleForm
          products={products}
          setProducts={setProducts}
          sales={sales}
          setSales={setSales}
        />
      </div>

      {/* Products Table */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Products</h3>
        <ProductList
          products={products}
          setProducts={setProducts}
          archivedProducts={archivedProducts}
          setArchivedProducts={setArchivedProducts}
        />
      </div>

      {/* Sales Table */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Sales</h3>
        <SaleHistory
          sales={sales}
          products={products}
          archivedProducts={archivedProducts}
          setSales={setSales}
        />
      </div>

      {/* Archived Products */}
      <div className="card">
        <h3>Archived Products</h3>
        <ArchivedProducts archivedProducts={archivedProducts} />
      </div>
    </div>
  );
};

export default Dashboard;
