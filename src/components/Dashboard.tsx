import React, { useState } from 'react';
import { Nameset, Product, Sale, Team } from '../types/types';
import AddProductForm from './AddProductForm';
import ArchivedNamesets from './ArchivedNamesets';
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
  archivedNamesets: Nameset[];
  setArchivedNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  archivedTeams: Team[];
  setArchivedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
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
}) => {
  const [isArchivedNamesetsExpanded, setIsArchivedNamesetsExpanded] = useState(false);
  const [archivedNamesetsSearchTerm, setArchivedNamesetsSearchTerm] = useState('');
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

      {/* Record Sale Card */}
      <div className="card">
        <div className="card-header mini-header mini-header-orange">Record Sale</div>
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
          archivedNamesets={archivedNamesets}
          teams={teams}
          archivedTeams={archivedTeams}
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
        <NamesetSection
          namesets={namesets}
          setNamesets={setNamesets}
          archivedNamesets={archivedNamesets}
          setArchivedNamesets={setArchivedNamesets}
        />

        {/* Archived Namesets Card */}
        <div className="card" style={{ marginTop: '20px' }}>
          {archivedNamesets.length > 0 ? (
            <>
              <div
                className="card-header mini-header mini-header-red"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onClick={() => setIsArchivedNamesetsExpanded(!isArchivedNamesetsExpanded)}
              >
                <span>Archived Namesets ({archivedNamesets.length})</span>
                <span style={{ fontSize: '12px' }}>{isArchivedNamesetsExpanded ? '▼' : '▶'}</span>
              </div>
              {!isArchivedNamesetsExpanded && (
                <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                  There are {archivedNamesets.length} namesets available.
                </div>
              )}
              {isArchivedNamesetsExpanded && (
                <>
                  <h3 className="card-section-header">Archived Namesets List</h3>
                  {archivedNamesets.length >= 2 && (
                    <div style={{ marginBottom: '15px' }}>
                      <input
                        type="text"
                        placeholder="Search archived namesets..."
                        value={archivedNamesetsSearchTerm}
                        onChange={(e) => setArchivedNamesetsSearchTerm(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #ccc',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                  )}
                  <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
                    <ArchivedNamesets
                      archivedNamesets={archivedNamesets}
                      setArchivedNamesets={setArchivedNamesets}
                      setNamesets={setNamesets}
                      searchTerm={archivedNamesetsSearchTerm}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="card-header mini-header mini-header-red">
                <span>Archived Namesets (0)</span>
              </div>
              <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                No archived namesets available.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
