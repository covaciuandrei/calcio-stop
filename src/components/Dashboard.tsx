import React from "react";
import { Nameset, Product, Sale } from "../types/types";
import AddProductForm from "./AddProductForm";
import ArchivedProducts from "./ArchivedProducts";
import NamesetSection from "./NamesetSection";
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
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
}

const Dashboard: React.FC<Props> = ({
  products,
  setProducts,
  archivedProducts,
  setArchivedProducts,
  sales,
  setSales,
  namesets,
  setNamesets,
}) => {
  return (
    <div>
      <h2>Dashboard Overview</h2>

      {/* Add Product Card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div
          className="card-header mini-header"
          style={{
            backgroundColor: "#d6eaf8",
            padding: "8px 12px",
            borderRadius: "4px",
            marginBottom: "12px",
          }}
        >
          Add Product
        </div>
        <AddProductForm products={products} setProducts={setProducts} />
      </div>

      {/* Record Sale Card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div
          className="card-header mini-header"
          style={{
            backgroundColor: "#fdebd0",
            padding: "8px 12px",
            borderRadius: "4px",
            marginBottom: "12px",
          }}
        >
          Record Sale
        </div>
        <SaleForm
          products={products}
          setProducts={setProducts}
          sales={sales}
          setSales={setSales}
        />
      </div>

      {/* Products Table */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div
          className="card-header mini-header"
          style={{
            backgroundColor: "#d5f5e3",
            padding: "8px 12px",
            borderRadius: "4px",
            marginBottom: "12px",
          }}
        >
          Products
        </div>
        <h3 style={{ marginBottom: "12px" }}>Product List</h3>
        <ProductList
          products={products}
          setProducts={setProducts}
          archivedProducts={archivedProducts}
          setArchivedProducts={setArchivedProducts}
        />
      </div>

      {/* Sales Table */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div
          className="card-header mini-header"
          style={{
            backgroundColor: "#f9e79f",
            padding: "8px 12px",
            borderRadius: "4px",
            marginBottom: "12px",
          }}
        >
          Sales
        </div>
        <h3 style={{ marginBottom: "12px" }}>Sale History</h3>
        <SaleHistory
          sales={sales}
          products={products}
          archivedProducts={archivedProducts}
          setSales={setSales}
        />
      </div>

      {/* Archived Products */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div
          className="card-header mini-header"
          style={{
            backgroundColor: "#f5b7b1",
            padding: "8px 12px",
            borderRadius: "4px",
            marginBottom: "12px",
          }}
        >
          Archived Products
        </div>
        <h3 style={{ marginBottom: "12px" }}>Archived List</h3>
        <ArchivedProducts archivedProducts={archivedProducts} />
      </div>

      {/* Namesets */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div
          className="card-header mini-header"
          style={{
            backgroundColor: "#d2b4de",
            padding: "8px 12px",
            borderRadius: "4px",
            marginBottom: "12px",
          }}
        >
          Namesets
        </div>
        <h3 style={{ marginBottom: "12px" }}>Manage Namesets</h3>
        <NamesetSection namesets={namesets} setNamesets={setNamesets} />
      </div>
    </div>
  );
};

export default Dashboard;
