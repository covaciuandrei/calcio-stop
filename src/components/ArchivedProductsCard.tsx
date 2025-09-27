import React, { useState } from 'react';
import { Nameset, Product, Team } from '../types/types';
import ArchivedProducts from './ArchivedProducts';

interface Props {
  archivedProducts: Product[];
  namesets: Nameset[];
  archivedNamesets: Nameset[];
  teams: Team[];
  archivedTeams: Team[];
}

const ArchivedProductsCard: React.FC<Props> = ({
  archivedProducts,
  namesets,
  archivedNamesets,
  teams,
  archivedTeams,
}) => {
  const [isArchivedProductsExpanded, setIsArchivedProductsExpanded] = useState(false);
  const [archivedProductsSearchTerm, setArchivedProductsSearchTerm] = useState('');

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      {archivedProducts.length > 0 ? (
        <>
          <div
            className="card-header mini-header mini-header-red"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            onClick={() => setIsArchivedProductsExpanded(!isArchivedProductsExpanded)}
          >
            <span>Archived Products ({archivedProducts.length})</span>
            <span style={{ fontSize: '12px' }}>{isArchivedProductsExpanded ? '▼' : '▶'}</span>
          </div>
          {!isArchivedProductsExpanded && (
            <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
              There are {archivedProducts.length} products available.
            </div>
          )}
          {isArchivedProductsExpanded && (
            <>
              <h3 className="card-section-header">Archived Products List</h3>
              {archivedProducts.length >= 2 && (
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="text"
                    placeholder="Search archived products..."
                    value={archivedProductsSearchTerm}
                    onChange={(e) => setArchivedProductsSearchTerm(e.target.value)}
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
                <ArchivedProducts
                  archivedProducts={archivedProducts}
                  namesets={namesets}
                  archivedNamesets={archivedNamesets}
                  teams={teams}
                  archivedTeams={archivedTeams}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="card-header mini-header mini-header-red">
            <span>Archived Products (0)</span>
          </div>
          <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
            No archived products available.
          </div>
        </>
      )}
    </div>
  );
};

export default ArchivedProductsCard;
