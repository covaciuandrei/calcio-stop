import React, { useState } from 'react';
import { Nameset, Product, Sale, Team } from '../types/types';
import EditSaleModal from './EditSaleModal';
import SalesTableList from './SalesTableList';

interface Props {
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  products: Product[];
  namesets: Nameset[];
  archivedNamesets: Nameset[];
  teams: Team[];
  archivedTeams: Team[];
}

const SalesTableListCard: React.FC<Props> = ({
  sales,
  setSales,
  products,
  namesets,
  archivedNamesets,
  teams,
  archivedTeams,
}) => {
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [isSalesExpanded, setIsSalesExpanded] = useState(true);
  const [salesSearchTerm, setSalesSearchTerm] = useState('');

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return;
    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEditClick = (sale: Sale) => {
    setEditingSale(sale);
  };

  return (
    <>
      <div className="card">
        {sales.length > 0 ? (
          <>
            <div
              className="card-header mini-header mini-header-orange"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onClick={() => setIsSalesExpanded(!isSalesExpanded)}
            >
              <span>Sales History ({sales.length})</span>
              <span style={{ fontSize: '12px' }}>{isSalesExpanded ? '▼' : '▶'}</span>
            </div>
            {!isSalesExpanded && (
              <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                There are {sales.length} sales recorded.
              </div>
            )}
            {isSalesExpanded && (
              <>
                <h3 className="card-section-header">Sales History</h3>
                {sales.length >= 2 && (
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="Search sales..."
                      value={salesSearchTerm}
                      onChange={(e) => setSalesSearchTerm(e.target.value)}
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
                  <SalesTableList
                    sales={sales}
                    products={products}
                    namesets={namesets}
                    archivedNamesets={archivedNamesets}
                    teams={teams}
                    archivedTeams={archivedTeams}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                    searchTerm={salesSearchTerm}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-orange">
              <span>Sales History (0)</span>
            </div>
            <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
              No sales recorded.
            </div>
          </>
        )}
      </div>

      <EditSaleModal editingSale={editingSale} setEditingSale={setEditingSale} setSales={setSales} />
    </>
  );
};

export default SalesTableListCard;
