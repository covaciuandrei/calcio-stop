import React, { useState } from 'react';
import { Nameset, Product, Sale, Team } from '../../types';
import styles from '../shared/TableListCard.module.css';
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
              className={`card-header mini-header mini-header-orange ${styles.expandableHeader}`}
              onClick={() => setIsSalesExpanded(!isSalesExpanded)}
            >
              <span>Sales History ({sales.length})</span>
              <span className={`${styles.expandIcon} ${isSalesExpanded ? styles.expanded : styles.collapsed}`}>▼</span>
            </div>
            {!isSalesExpanded && (
              <div className={styles.collapsedContent}>There are {sales.length} sales recorded.</div>
            )}
            {isSalesExpanded && (
              <>
                <h3 className="card-section-header">Sales History</h3>
                {sales.length >= 2 && (
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="Search sales..."
                      value={salesSearchTerm}
                      onChange={(e) => setSalesSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                )}
                <div className={styles.tableContainer}>
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
            <div className={styles.emptyState}>No sales recorded.</div>
          </>
        )}
      </div>

      <EditSaleModal editingSale={editingSale} setEditingSale={setEditingSale} setSales={setSales} />
    </>
  );
};

export default SalesTableListCard;
