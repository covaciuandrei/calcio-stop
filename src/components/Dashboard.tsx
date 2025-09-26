import React, { useState } from 'react';
import { Badge, Nameset, Product, Sale, Team } from '../types/types';
import AddBadgeForm from './AddBadgeForm';
import AddProductForm from './AddProductForm';
import ArchivedBadges from './ArchivedBadges';
import ArchivedNamesets from './ArchivedNamesets';
import ArchivedProducts from './ArchivedProducts';
import BadgeTableList from './BadgeTableList';
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
  const [isArchivedNamesetsExpanded, setIsArchivedNamesetsExpanded] = useState(false);
  const [archivedNamesetsSearchTerm, setArchivedNamesetsSearchTerm] = useState('');
  const [isArchivedBadgesExpanded, setIsArchivedBadgesExpanded] = useState(false);
  const [archivedBadgesSearchTerm, setArchivedBadgesSearchTerm] = useState('');
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [editName, setEditName] = useState('');
  const [editSeason, setEditSeason] = useState('2025/2026');
  const [editQuantity, setEditQuantity] = useState<number | ''>('');
  const [isBadgesExpanded, setIsBadgesExpanded] = useState(true);
  const [badgesSearchTerm, setBadgesSearchTerm] = useState('');

  // Badge handling functions
  const handleBadgeArchive = (id: string) => {
    if (!window.confirm('Are you sure you want to archive this badge?')) return;
    const badgeToArchive = badges.find((b) => b.id === id);
    if (badgeToArchive) {
      setArchivedBadges((prev) => [...prev, badgeToArchive]);
      setBadges(badges.filter((b) => b.id !== id));
    }
  };

  const handleBadgeEditClick = (b: Badge) => {
    setEditingBadge(b);
    setEditName(b.name);
    setEditSeason(b.season);
    setEditQuantity(b.quantity);
  };

  const handleBadgeSaveEdit = () => {
    if (!editName.trim()) return alert('Badge name cannot be empty');
    if (editQuantity === '' || editQuantity < 0) return alert('Quantity must be 0 or greater');

    setBadges((prev) =>
      prev.map((b) =>
        b.id === editingBadge?.id
          ? {
              ...b,
              name: editName.trim(),
              season: editSeason,
              quantity: Number(editQuantity),
            }
          : b
      )
    );
    setEditingBadge(null);
  };

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

      {/* Manage Badges */}
      <div className="card">
        <div className="card-header mini-header mini-header-purple">Manage Badges</div>

        {/* Add New Badge Card */}
        <div className="card">
          <div className="card-header mini-header mini-header-green">
            <span>Add New Badge</span>
          </div>
          <div className="card-content">
            <AddBadgeForm badges={badges} setBadges={setBadges} />
          </div>
        </div>

        {/* Badges List Card */}
        <div className="card">
          {badges.length > 0 ? (
            <>
              <div
                className="card-header mini-header mini-header-orange"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onClick={() => setIsBadgesExpanded(!isBadgesExpanded)}
              >
                <span>Active Badges ({badges.length})</span>
                <span style={{ fontSize: '12px' }}>{isBadgesExpanded ? '▼' : '▶'}</span>
              </div>
              {!isBadgesExpanded && (
                <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                  There are {badges.length} badges available.
                </div>
              )}
              {isBadgesExpanded && (
                <>
                  <h3 className="card-section-header">Active Badges List</h3>
                  {badges.length >= 2 && (
                    <div style={{ marginBottom: '15px' }}>
                      <input
                        type="text"
                        placeholder="Search badges..."
                        value={badgesSearchTerm}
                        onChange={(e) => setBadgesSearchTerm(e.target.value)}
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
                    <BadgeTableList
                      badges={badges}
                      onEdit={handleBadgeEditClick}
                      onArchive={handleBadgeArchive}
                      searchTerm={badgesSearchTerm}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="card-header mini-header mini-header-orange">
                <span>Active Badges (0)</span>
              </div>
              <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                No active badges available.
              </div>
            </>
          )}
        </div>

        {/* Archived Badges Card */}
        <div className="card" style={{ marginTop: '20px' }}>
          {archivedBadges.length > 0 ? (
            <>
              <div
                className="card-header mini-header mini-header-red"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onClick={() => setIsArchivedBadgesExpanded(!isArchivedBadgesExpanded)}
              >
                <span>Archived Badges ({archivedBadges.length})</span>
                <span style={{ fontSize: '12px' }}>{isArchivedBadgesExpanded ? '▼' : '▶'}</span>
              </div>
              {!isArchivedBadgesExpanded && (
                <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                  There are {archivedBadges.length} badges available.
                </div>
              )}
              {isArchivedBadgesExpanded && (
                <>
                  <h3 className="card-section-header">Archived Badges List</h3>
                  {archivedBadges.length >= 2 && (
                    <div style={{ marginBottom: '15px' }}>
                      <input
                        type="text"
                        placeholder="Search archived badges..."
                        value={archivedBadgesSearchTerm}
                        onChange={(e) => setArchivedBadgesSearchTerm(e.target.value)}
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
                    <ArchivedBadges
                      archivedBadges={archivedBadges}
                      setArchivedBadges={setArchivedBadges}
                      setBadges={setBadges}
                      searchTerm={archivedBadgesSearchTerm}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="card-header mini-header mini-header-red">
                <span>Archived Badges (0)</span>
              </div>
              <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                No archived badges available.
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Badge Modal */}
      {editingBadge && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Badge</h3>
            <label>
              Badge Name:
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </label>
            <label>
              Season:
              <select value={editSeason} onChange={(e) => setEditSeason(e.target.value)}>
                {Array.from({ length: 41 }, (_, i) => {
                  const year = 1990 + i;
                  const season = `${year}/${year + 1}`;
                  return (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  );
                })}
              </select>
            </label>
            <label>
              Quantity:
              <input
                type="number"
                min={0}
                value={editQuantity}
                onChange={(e) => setEditQuantity(parseInt(e.target.value) || '')}
              />
            </label>

            <div className="modal-buttons">
              <button onClick={handleBadgeSaveEdit} className="btn btn-success">
                Save
              </button>
              <button onClick={() => setEditingBadge(null)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
