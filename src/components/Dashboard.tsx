import React from 'react';
import { Badge, Nameset, Product, Sale, Team } from '../types';
import BadgesPage from './badges/BadgesPage';
import NamesetsPage from './namesets/NamesetsPage';
import ProductsPage from './products/ProductsPage';
import SalesPage from './sales/SalesPage';
import TeamsPage from './teams/TeamsPage';

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
      {/* Manage Products */}
      <div className="card">
        <div className="card-header mini-header mini-header-purple">Manage Products</div>
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
