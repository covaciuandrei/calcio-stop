import React, { useState } from 'react';
import { Nameset, Product, Team } from '../../types';
import styles from '../shared/TableListCard.module.css';
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
    <div className="card" style={{ marginTop: 'var(--space-5)' }}>
      {archivedProducts.length > 0 ? (
        <>
          <div
            className={`card-header mini-header mini-header-red ${styles.expandableHeader}`}
            onClick={() => setIsArchivedProductsExpanded(!isArchivedProductsExpanded)}
          >
            <span>Archived Products ({archivedProducts.length})</span>
            <span className={`${styles.expandIcon} ${isArchivedProductsExpanded ? styles.expanded : styles.collapsed}`}>
              ▼
            </span>
          </div>
          {!isArchivedProductsExpanded && (
            <div className={styles.collapsedContent}>There are {archivedProducts.length} products available.</div>
          )}
          {isArchivedProductsExpanded && (
            <>
              <h3 className="card-section-header">Archived Products List</h3>
              {archivedProducts.length >= 2 && (
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search archived products..."
                    value={archivedProductsSearchTerm}
                    onChange={(e) => setArchivedProductsSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              )}
              <div className={styles.tableContainer}>
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
          <div className={styles.emptyState}>No archived products available.</div>
        </>
      )}
    </div>
  );
};

export default ArchivedProductsCard;
