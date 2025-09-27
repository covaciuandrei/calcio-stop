import React from 'react';
import { Badge, Nameset, Product, Sale, Team } from '../types/types';
import AddProductForm from './AddProductForm';
import ArchivedProducts from './ArchivedProducts';
import BadgesPage from './BadgesPage';
import NamesetsPage from './NamesetsPage';
import ProductList from './ProductList';
import SalesPage from './SalesPage';
import TeamsPage from './TeamsPage';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  archivedProducts: Product[];
  setArchivedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  archivedNamesets: Nameset[];
  setArchivedNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  archivedTeams: Team[];
  setArchivedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  archivedBadges: Badge[];
  setArchivedBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
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
  archivedNamesets,
  setArchivedNamesets,
  teams,
  setTeams,
  archivedTeams,
  setArchivedTeams,
  badges,
  setBadges,
  archivedBadges,
  setArchivedBadges,
}) => {
  return (
    <div>
      <h1 className="section-header">Dashboard Overview</h1>

      {/* Add Product Card */}
      <div className="card add-product-card">
        <div className="card-header mini-header mini-header-blue">Add Product</div>
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
      </div>

      {/* Manage Sales */}
      <div className="card">
        <div className="card-header mini-header mini-header-purple">Manage Sales</div>
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
          setNamesets={setNamesets}
          archivedNamesets={archivedNamesets}
          setArchivedNamesets={setArchivedNamesets}
          teams={teams}
          setTeams={setTeams}
          archivedTeams={archivedTeams}
          setArchivedTeams={setArchivedTeams}
        />
      </div>

      {/* Archived Products */}
      <div className="card">
        <div className="card-header mini-header mini-header-red">Archived Products</div>
        <h3 className="card-section-header">Archived List</h3>
        <ArchivedProducts
          archivedProducts={archivedProducts}
          namesets={namesets}
          archivedNamesets={archivedNamesets}
          teams={teams}
          archivedTeams={archivedTeams}
        />
      </div>

      {/* Manage Namesets */}
      <div className="card">
        <div className="card-header mini-header mini-header-purple">Manage Namesets</div>
        <NamesetsPage
          namesets={namesets}
          setNamesets={setNamesets}
          archivedNamesets={archivedNamesets}
          setArchivedNamesets={setArchivedNamesets}
        />
      </div>

      {/* Manage Teams */}
      <div className="card">
        <div className="card-header mini-header mini-header-purple">Manage Teams</div>
        <TeamsPage
          teams={teams}
          setTeams={setTeams}
          archivedTeams={archivedTeams}
          setArchivedTeams={setArchivedTeams}
        />
      </div>

      {/* Manage Badges */}
      <div className="card">
        <div className="card-header mini-header mini-header-purple">Manage Badges</div>
        <BadgesPage
          badges={badges}
          setBadges={setBadges}
          archivedBadges={archivedBadges}
          setArchivedBadges={setArchivedBadges}
        />
      </div>
    </div>
  );
};

export default Dashboard;
