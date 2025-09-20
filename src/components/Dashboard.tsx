import React from 'react';
import { Nameset, Product, Sale } from '../types/types';
import AddProductForm from './AddProductForm';
import ArchivedProducts from './ArchivedProducts';
import NamesetSection from './NamesetSection';
import ProductList from './ProductList';
import SaleForm from './SaleForm';
import SaleHistory from './SaleHistory';

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
      <h1 className="section-header">Dashboard Overview</h1>

      {/* Add Product Card */}
      <div className="card">
        <div className="card-header mini-header mini-header-blue">Add Product</div>
        <AddProductForm products={products} setProducts={setProducts} namesets={namesets} setNamesets={setNamesets} />
      </div>

      {/* Record Sale Card */}
      <div className="card">
        <div className="card-header mini-header mini-header-orange">Record Sale</div>
        <SaleForm products={products} setProducts={setProducts} sales={sales} setSales={setSales} namesets={namesets} />
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="card-header mini-header mini-header-green">Products</div>
        <h3 className="card-section-header">Product List</h3>
        <ProductList
          products={products}
          setProducts={setProducts}
          archivedProducts={archivedProducts}
          setArchivedProducts={setArchivedProducts}
          namesets={namesets}
        />
      </div>

      {/* Sales Table */}
      <div className="card">
        <div className="card-header mini-header mini-header-yellow">Sales</div>
        <h3 className="card-section-header">Sale History</h3>
        <SaleHistory
          sales={sales}
          products={products}
          archivedProducts={archivedProducts}
          setSales={setSales}
          namesets={namesets}
        />
      </div>

      {/* Archived Products */}
      <div className="card">
        <div className="card-header mini-header mini-header-red">Archived Products</div>
        <h3 className="card-section-header">Archived List</h3>
        <ArchivedProducts archivedProducts={archivedProducts} namesets={namesets} />
      </div>

      {/* Namesets */}
      <div className="card">
        <div className="card-header mini-header mini-header-purple">Namesets</div>
        <h3 className="card-section-header">Manage Namesets</h3>
        <NamesetSection namesets={namesets} setNamesets={setNamesets} />
      </div>
    </div>
  );
};

export default Dashboard;
